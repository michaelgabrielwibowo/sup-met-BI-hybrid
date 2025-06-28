export class Question {
  constructor(query, type) {
    this._query = query;
    this._type = type;
  }

  query() {
    return this._query;
  }

  type() {
    return this._type;
  }
}

export class QueryResult {
  constructor(data, error = null, error_type = null, via = null, duration = null) {
    this.data = data;
    this.error = error;
    this.error_type = error_type;
    this.via = via;
    this.duration = duration;
  }
}
