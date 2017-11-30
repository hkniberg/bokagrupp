

import Grid from 'gridfs-stream'; // We'll use this package to work with GridFS
import fs from 'fs';              // Required to read files initially uploaded via Meteor-Files
import { MongoInternals } from 'meteor/mongo';
import {Courses} from "./collection"

// Here we initialize the file upload/download functionality .
// Uploads are stored using GridFS (= special Mongo collections).

// Set up grid file store instance (for PDF files and such)
// https://github.com/VeliovGroup/Meteor-Files/wiki/GridFS-Integration
let gfs;
if (Meteor.isServer) {
  gfs = Grid(
    MongoInternals.defaultRemoteCollectionDriver().mongo.db,
    MongoInternals.NpmModule
  );
}

// https://github.com/VeliovGroup/meteor-autoform-file
// https://github.com/VeliovGroup/Meteor-Files/wiki/GridFS-Integration
export const Uploads = new FilesCollection({
  collectionName: 'uploads',
  allowClientCode: true, // Required to let you remove uploaded file
  onBeforeUpload: function (file) {
    console.log("Before upload")
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg|pdf/i.test(file.ext)) {
      console.log("Done!")
      return true;
    } else {
      console.log("Too big!")
      return 'Please upload PDF or image file with size equal or less than 10MB';
    }
  },
  onAfterUpload(file) {
    console.log("After upload")
    // Move file to GridFS
    Object.keys(file.versions).forEach(versionName => {
      const metadata = { versionName, imageId: file._id, storedAt: new Date() }; // Optional
      const writeStream = gfs.createWriteStream({ filename: file.name, metadata });

      fs.createReadStream(file.versions[versionName].path).pipe(writeStream);

      writeStream.on('close', Meteor.bindEnvironment(file => {
        console.log("on Close")
        const property = `versions.${versionName}.meta.gridFsFileId`;
        const fileId = file.metadata.imageId
        this.collection.update({_id: fileId}, { $set: { [property]: file._id.toString() } });
        this.unlink(this.collection.findOne({_id: fileId}), versionName); // Unlink file by version from FS
        console.log("finished onclose")
      }));
    });
  },
  interceptDownload(http, file, versionName) {
    const _id = (file.versions[versionName].meta || {}).gridFsFileId;
    if (_id) {
      const readStream = gfs.createReadStream({ _id });
      readStream.on('error', err => { throw err; });
      readStream.pipe(http.response);
    }
    return Boolean(_id); // Serve file from either GridFS or FS if it wasn't uploaded yet
  },
  onAfterRemove(files) {
    // Remove corresponding file from GridFS
    files.forEach(file => {
      removeReferencesToFile(file)

      Object.keys(file.versions).forEach(versionName => {
        const _id = (file.versions[versionName].meta || {}).gridFsFileId;
        if (_id) gfs.remove({ _id }, err => { if (err) throw err; });
      });
    });

  }
})

/**
 * This method is a workaround for a bug(?) in ostrio:autoform-files.
 * Autoform automatically sets file fields, but doesn't seem to unset them on removal.
 * So we do that here.
 */
function removeReferencesToFile(file) {
  Courses.update({logoFile: file._id}, {$unset: {logoFile: 0}})
}

if (Meteor.isClient) {
  // Warrants needs to be in global scope for file upload to work
  // https://github.com/VeliovGroup/meteor-autoform-file
  global["uploads"] = Uploads;
}


export function getUploadUrl(fileId) {
  const upload = Uploads.findOne({_id: fileId})
  return "/cdn/storage/uploads/" + fileId + "/original/" + fileId + "." + upload.ext
}

