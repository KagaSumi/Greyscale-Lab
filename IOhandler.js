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
  return new Promise((resolve, reject) => {
    createReadStream(pathIn)
      .on("error", reject)
      .pipe(unzipper.Extract({ path: pathOut }))
      .on("error", reject)
      .promise()
      .then(() => resolve("Extraction Operation Complete"));
  });
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = dir => {
  return new Promise((resolve, reject) => {
    fs
      .readdir(dir)
      .then(files => {
        const output = [];
        files.forEach(file => {
          if (path.extname(file) == ".png") {
            output.push(file);
          }
        });
        resolve(output);
      })
      .catch(err => {
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
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    readDir(pathIn)
      .then((files) => {
        const promises = [];
        for (const file of files) {
          const source = path.join(pathIn, file);
          const destination = path.join(pathOut, file);
          promises.push(
            new Promise((resolve) => {
              createReadStream(source)
                .pipe(
                  new PNG({
                    filterType: 4,
                  })
                )
                .on("parsed", function () {
                  for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                      const idx = (this.width * y + x) << 2;
                      this.data[idx] = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
                      this.data[idx + 1] = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
                      this.data[idx + 2] = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
                    }
                  }

                  this.pack().pipe(createWriteStream(destination)).on("finish", resolve);
                });
            })
          );
        }
        return Promise.all(promises);
      })
      .then(() => resolve("Grayscale Completed"))
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale
};
