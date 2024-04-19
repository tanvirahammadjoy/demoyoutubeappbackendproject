class ApiRespons {
  constructor(statusCode, data, massag = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.massag = massag;
    this.success = statusCode < 400;
  }
}

export default ApiRespons;
