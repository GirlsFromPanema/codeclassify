Model::Model(std::string title)
{
    Model::path = title;
}

void Model::Draw(Mesh mesh, VAO vao)
{
}

string Model::getstr()
{
    int v = 0;
    int t = 0;
    int f = 0;
    string line;
    string check;

    ifstream myfile(path, ios::in);

    glm::vec3 vert;

    int count = 0;

    string data[3];
    int dataind;

    if (myfile.is_open())
    {

        while (getline(myfile, line))
        {
            check = line;
            if (check.substr(0, 2) == "v ")
            {
                count = 2;
                dataind = 0;
                data[0] = "";
                data[1] = "";
                data[2] = "";
                while (check[count] != '\0')
                {

                    if (check[count] == ' ')
                    {
                        dataind++;
                        count++;
                    }
                    data[dataind] += check[count];
                    count++;
                }

                vert = glm::vec3(stof(data[0]), stof(data[1]), stof(data[2]));
                cout << to_string(vert) << endl;
            }
            if (check.substr(0, 2) == "vt")
            {
            }
            if (check.substr(0, 2) == "f ")
            {
            }
        }
        myfile.close();
    }
    else
    {
        cout << "Unable to open file";
        return "0";
    }
    return "a";
}