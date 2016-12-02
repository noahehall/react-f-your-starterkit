import idb from 'idb';
import Promised from 'bluebird';

/**
 * Wrapper around jake's idb for connecting to indexdb
 * @class Idbstore
 */
export class Idbstore {
  constructor (def = false, dbName = appConsts.dbName, initialStore = appConsts.initialStore) {
    this.success = false;
    this.error = false;
    this.def = def;
    this.dbName = dbName;
    // 0 indexed
    this.store = `${initialStore}${appConsts.appVersion ? appConsts.appVersion - 1 : 0}`;
    this.dbPromise = idb.open(
      this.dbName,
      appConsts.appVersion,
      (upgradeDB) => {
        // 1 indexed
        let idx = upgradeDB.objectStoreNames ?
          upgradeDB.objectStoreNames.length :
          0;

        appFuncs.console('info')(`oldVersion: ${upgradeDB.oldVersion}, appVersion: ${appConsts.appVersion}, idx: ${idx}`);
        while (idx < appConsts.appVersion) {
          const storeDef = [`${initialStore}${idx++}`];
          if (this.def) storeDef.push(def);
          upgradeDB.createObjectStore(...storeDef);
        }
      }
    ).then(
      (good) => {
        this.success = true;

        return good;
      },
      (bad) => this.error = bad
    ).catch((err) => this.catch = err);
  }

  clear (store = this.store) {
    return this.dbPromise.then((db) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).clear(key);

      return tx.complete;
    });
  }

  delete (key, store = this.store) {
    return this.dbPromise.then((db) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(key);

      return tx.complete;
    });
  }

  /**
   * get a single object from store
   * @method get
   * @param  {[type]} key                [description]
   * @param  {[type]} [store=this.store] [description]
   * @return {[type]} [description]
   */
  get (key, store = this.store) {
    return this.dbPromise.then((db) =>
      db.transaction(store).objectStore(store).get(key)
    );
  }

  /**
   * get all objects from store
   * @returns {*} data from indexeddb
   */
  getAll () {
    return this.dbPromise.then((db) =>
      db.transaction(this.store)
        .objectStore(this.store)
        .getAll())
      .then((allObjs) => allObjs);
  }

  /**
   * Returns all keys matching the string
   * @param {String} [store=this.store] The object store name
   * @param {String} [string='http'] The string to match against
   * @returns {Promise} possibly resolving to an array filled with key names
   */
  getKeysMatching (store = this.store, string = 'http') {
    return this.dbPromise.then((db) => {
      const tx = db.transaction(store);
      const thisStore = tx.objectStore(store);

      return thisStore.getAllKeys()
        .then(
          (allKeys) =>
            allKeys.filter((thisKey) =>
              thisKey.includes(string)
          ),
          (someError) => appFuncs.console('error')(someError)
        );
    });
  }

  /**
   * reads data from a blob
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Blob
   * @see https://developer.mozilla.org/en-US/docs/Web/API/FileReader
   * @param {Blob|File} blobOrFile a blob or file object
   * @returns {Promise} data from blobOrFile
   */
  fileReader (blobOrFile) {
    if (FileReader)
      return new Promised((resolve, reject) => { // eslint-disable-line consistent-return
        if (!(blobOrFile instanceof Blob || blobOrFile instanceof File))
          return reject(new Error(`blobOrFile is of incorrect type: ${blobOrFile.constructor}, ${blobOrFile}`));

        const thisReader = new FileReader();
        thisReader.addEventListener("loadend", () =>
          resolve(thisReader.result)
        );

        thisReader.readAsText(blobOrFile);
      });

    return Promise.reject(new Error('FileReader is not available'));
  }

  /**
   * returns all blob values from indexeddb
   * @method getAllBlobValues
   * @author @noahedwardhall
   * @see http://qnimate.com/an-introduction-to-javascript-blobs-and-file-interface/
   * @type {String} [url='http'] the string to match against
   * @returns {Promise} possibly filled with blobs
   */
  getAllBlobValues () {
    const blobs = [];

    return this.dbPromise.then((db) =>
      db.transaction(this.store).objectStore(this.store).getAll())
      .then((allBlobs) => {
        allBlobs.forEach((blob) =>
          blobs.push(this.fileReader(blob))
        );

        return blobs;
      });
  }

  /**
   * Gets all key values from Objecstore
   * @method keys
   * @param {String} [store=this.store] the store name
   * @returns {Array} all key values
   */
  keys (store = this.store) {
    return this.dbPromise.then((db) => {
      const tx = db.transaction(store);
      const thisStore = tx.objectStore(store);

      return thisStore.getAllKeys()
        .then(
          (allKeys) => allKeys,
          (badKeys) => appFuncs.console('error')(badKeys)
        );
    });
  }

  set (key, val, store = this.store) {
    return this.dbPromise.then((db) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(val, key);

      return tx.complete;
    });
  }
}

export default Idbstore;
