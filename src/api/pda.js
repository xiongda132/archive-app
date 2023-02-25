import request from "./request";

export function pdaConfig(params = {}) {
  return request("/v1/PDAtransfer/config", {
    scanType: 1,
    rfidReadpower: 30,
    rfidWritepower: 10,
    ...params,
  });
}

export function pdaStart(params = {}) {
  return request("/v1/PDAtransfer/rfidstart", {
    startTime: "2022-12-09 11:11:11:123",
    ...params,
  });
}

export function padStop(params = {}) {
  return request("/v1/PDAtransfer/rfidstop", {
    endTime: "2022-12-09 11:11:11:123",
    ...params,
  });
}

export function queryPdaData(params = {}) {
  return request("/v1/PDAtransfer/rfidqueryData", {
    startTime: "2021-06-15 14:16:13",
    rows: 1000,
    ...params,
  });
}
