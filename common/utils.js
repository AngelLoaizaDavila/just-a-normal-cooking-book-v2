module.exports.isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
module.exports.formatResponse = function (result) {
  if (result.statusCode != null) {
    const response = {
      statusCode: result.statusCode,
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: result.body
    }

    if (result.headers) {
      if (result.headers['Content-Type']) {
        response.headers['Content-Type'] = result.headers['Content-Type']
      }
      if (result.headers.Expires) {
        response.headers.Expires = result.headers.Expires
      } else if (result.headers['Cache-Control']) {
        response.headers['Cache-Control'] = result.headers['Cache-Control']
      } else {
        // default cache
        response.headers['Cache-Control'] = 'max-age=0'
      }
      response.headers = { ...response.headers, ...result.headers }
    }

    return response
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=0'
    },
    body: JSON.stringify(result)
  }
}