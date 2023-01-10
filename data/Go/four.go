func Build(config *conf.Configuration) {
	if err := os.MkdirAll(config.Threads.Destination, 0755); err != nil {
		logrus.Fatalf("Failed to create output dir: %v", err)
	}

	threads, err := filepath.Glob(config.Threads.Source + "/*/*/*")
	if err != nil {
		logrus.Fatalf("Failed to list threads: %v", err)
	}

	var wg sync.WaitGroup
	sem := make(chan int, 100)

	for _, thread := range threads {
		sem <- 1
		wg.Add(1)
		go func(t string) {
			generate(t, config.Threads.Destination)
			<-sem
			wg.Done()
		}(thread)
	}

	wg.Wait()

	emptyPath := path.Join(config.Threads.Destination, "empty.json")
	empty, err := os.Create(emptyPath)
	if err != nil {
		log.Fatalf("Error opening the empty file %v: %v", emptyPath, err)
	}
	defer empty.Close()
	empty.WriteString("[]")

	countPath := path.Join(config.Threads.Destination, "empty.count.json")
	count, err := os.Create(countPath)
	if err != nil {
		log.Fatalf("Error opening the count file %v: %v", countPath, err)
	}
	defer count.Close()
	count.WriteString(fmt.Sprintf("{\"count\": %v}", 0))

	redirectsPath := path.Join(config.Threads.Destination, "_redirects")
	redirects, err := os.Create(redirectsPath)
	if err != nil {
		log.Fatalf("Error opening the redirects file %v: %v", redirectsPath, err)
	}
	defer redirects.Close()
	redirects.WriteString(`
/*.count.json  /empty.count.json   200
/*.json  /empty.json  200
`)
}