const graphQlRequest = async (requestBody, header) => {
  return fetch("http://localhost:8000/graphql", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: header,
  })
    .then((res) => {
      return res.json();
    })
    .then((resData) => {
      return resData;
    })
    .catch((err) => {
      this.setState({
        isLoading: false,
      });
      throw new Error(err);
    });
};

module.exports = {
    graphQlRequest
}