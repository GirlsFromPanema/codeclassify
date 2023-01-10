package carve

import (
	"fmt"
	"image"
	"math"

	"github.com/disintegration/gift"
	"github.com/disintegration/imaging"
)

// ReduceHeight uses seam carving to reduce height of given image by n pixels.
func ReduceHeight(im image.Image, n int) (image.Image, error) {
	height := im.Bounds().Max.Y - im.Bounds().Min.Y
	if height < n {
		return im, fmt.Errorf("Cannot resize image of height %d by %d pixels", height, n)
	}

	for x := 0; x < n; x++ {
		energy := GenerateEnergyMap(im)
		seam := GenerateSeam(energy)
		im = RemoveSeam(im, seam)
	}
	return im, nil
}

// ReduceWidth uses seam carving to reduce width of given image by n pixels.
func ReduceWidth(im image.Image, n int) (image.Image, error) {
	width := im.Bounds().Max.Y - im.Bounds().Min.Y
	if width < n {
		return im, fmt.Errorf("Cannot resize image of width %d by %d pixels", width, n)
	}

	i := imaging.Rotate90(im)
	out, err := ReduceHeight(i, n)
	return imaging.Rotate270(out), err
}

// GenerateEnergyMap applies grayscale and sobel filters to the
// input image to create an energy map.
func GenerateEnergyMap(im image.Image) image.Image {
	g := gift.New(gift.Grayscale(), gift.Sobel())
	res := image.NewRGBA(im.Bounds())
	g.Draw(res, im)
	return res
}

// GenerateSeam returns the optimal horizontal seam for removal.
func GenerateSeam(im image.Image) Seam {
	mat := GenerateCostMatrix(im)
	return FindLowestCostSeam(mat)
}