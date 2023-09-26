class Storage {
  constructor(localStorage) {
    this.storage = localStorage;
    this.dataKey = 'data';
  }

  insertData(data) {
    // easy way => wir clearn alles und setzen den key samt Daten neu
    // this.localStorage.removeItem(this.dataKey);
    this.storage.setItem(this.dataKey, JSON.stringify(data));
  }

  getData() {
    let dataString = this.storage.getItem(this.dataKey);
    return JSON.parse(dataString);
  }
}
