# LibEFT.JS Prototype Tech Demo

LibEFT.JS Prototype Tech Demo is a JavaScript implementation of the LibEFT library, directly based on the Python port (LibEFT Python) of LibEFT. It serves as a prototype and tech demo to demonstrate the feasibility of using LibEFT on the web without any dependencies.

## About LibEFT

LibEFT is a library designed to handle EFT (Emergency File Textures) files used in the Emergency Series. EFT files contain a map texture. The library provides functionality to read and manipulate EFT files.

## Purpose of the Prototype Tech Demo

The LibEFT.JS Prototype Tech Demo aims to showcase the conversion of LibEFT Python to JavaScript, allowing the usage of LibEFT functionality directly in web applications. It demonstrates that EFT file conversion and manipulation can be done on the web without any external dependencies.

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

Please note that the LibEFT.JS Prototype Tech Demo is a proof-of-concept and has certain limitations:
- It only supports a subset of LibEFT functionality.
- The performance may vary depending on the size and complexity of the EFT file.
- It may not handle all types of EFT files correctly.
- EFT seams are completely unfixed and completely wrong.
- The texture data stream is incorrect and results in weird behaviour.

## Contributions

Contributions to the LibEFT.JS Prototype Tech Demo are welcome. If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request on the GitHub repository.
