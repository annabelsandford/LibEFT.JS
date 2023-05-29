# LibEFT.JS Prototype Tech Demo

[![GitHub](https://img.shields.io/github/license/annabelsandford/LibEFT.JS)](https://github.com/annabelsandford/LibEFT.JS/blob/main/LICENSE)

LibEFT.JS Prototype Tech Demo is a JavaScript implementation of the LibEFT library, directly based on the Python port (LibEFT Python) of LibEFT. It serves as a prototype and tech demo to demonstrate the feasibility of using LibEFT on the web without any dependencies.

## Live Demo

Experience the LibEFT.JS Prototype Tech Demo in action with the [Live Demo](https://htmlpreview.github.io/?https://github.com/annabelsandford/LibEFT.JS/blob/main/eft.html).

## About LibEFT

LibEFT is a library designed to handle EFT (Emergency File Textures) files used in the Emergency Series. EFT files contain map textures used in the game. The library provides functionality to read and manipulate EFT files.

This JavaScript implementation of LibEFT is based on the Python port [LibEFT Python](https://github.com/annabelsandford/libeft-py/blob/main/eft.py). The goal is to bring the power of LibEFT to web applications and enable EFT file conversion and manipulation directly in the browser.

## Purpose of the Prototype Tech Demo

The LibEFT.JS Prototype Tech Demo serves as a proof-of-concept to showcase the capabilities of LibEFT in a web environment. It demonstrates that EFT file conversion and manipulation can be achieved on the web without any external dependencies. This tech demo provides developers with a starting point for incorporating LibEFT functionality into their web applications.

## Features

- Conversion of EFT tile's S3TC texture data to RGBA format
- Writing RGBA blocks from an EFT's tilemap into the RGBA buffer
- Parsing and processing of EFT files
- Rendering the output in the browser using HTML5 Canvas

## Usage

To use the LibEFT.JS Prototype Tech Demo, follow these steps:

1. Clone the repository or download the source code.
2. Open the `index.html` file in a web browser.
3. Click on the file input field and select an EFT file to upload.
4. The tech demo will parse the EFT file and display the converted RGBA image on the canvas.

## Limitations

Please note the following limitations of the LibEFT.JS Prototype Tech Demo:

- It only supports a subset of LibEFT functionality.
- Performance may vary depending on the size and complexity of the EFT file.
- It may not handle all types of EFT files correctly.
- EFT seams are completely unfixed and may appear incorrect.
- The texture data stream may exhibit unexpected behavior.

## Contributions

Contributions to the LibEFT.JS Prototype Tech Demo are welcome. If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/annabelsandford/LibEFT.JS).

## Authors

We would like to express our gratitude to the following individuals for their contributions to the LibEFT project:

- [Sabrina Annabel Sandford](https://github.com/annabelsandford) - Author of the LibEFT.JS Prototype Tech Demo and the Python port (LibEFT Python)
- [FuzzyQuills](https://github.com/FuzzyQuills) - Creator of the original C LibEFT

## License

The LibEFT.JS Prototype Tech Demo is licensed under the [BSD-3 Clause](https://github.com/annabelsandford/LibEFT.JS/blob/main/LICENSE)
