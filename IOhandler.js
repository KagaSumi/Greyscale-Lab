/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author: Quinten Leung
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs").promises,
  { createReadStream, createWriteStream } = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((reject) => {
      createReadStream(pathIn)
        .on('error', reject)
        .pipe(unzipper.Extract({ path: pathOut }))
        .on('error', reject)
        .promise()
        .then(() => console.log("done", e => console.log("Error", e)));
    
  });
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir)
      .then((files) => {
        const output = [];
        files.forEach((file) => {
          if (path.extname(file) == ".png") {
            output.push(file);
          }
        });
        resolve(output);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {};

module.exports = {
  unzip,
  readDir,
  grayScale
};
