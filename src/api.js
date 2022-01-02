const API_ENDPOINT = 'https://www.speedrun.com/api/v1'

const api = {

  getGame(id) {
    return this.apiRequest(`${API_ENDPOINT}/games/${id}`)
  },

  getGames(){
    return this.apiRequest(`${API_ENDPOINT}/games`)
  },

  getGameCategories(id) {
    return this.apiRequest(`${API_ENDPOINT}/games/${id}/categories`)
  },

  getGameLevels(id) {
    return this.apiRequest(`${API_ENDPOINT}/games/${id}/levels`)
  },

  getGameLeaderboards(id, cat) {
    return this.apiRequest(`${API_ENDPOINT}/leaderboards/${id}/category/${cat}?top=50`)
    //return this.apiRequest(`${API_ENDPOINT}/runs?game=${id}&category=${cat}`)
  },

  getUserInfo(id) {
    return this.apiRequest(`${API_ENDPOINT}/users/${id}`)
  },

  getUserRuns(user) {
    return this.apiRequest(`${API_ENDPOINT}/users/${user}/personal-bests`)
  },

  getCategory(id) {
    return this.apiRequest(`${API_ENDPOINT}/categories/${id}`)
  },

  apiRequest(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(data => {
            if (!data.ok) {
              throw data.statusText
            }
            data.json()
                .then(jsonData => {
                  let response = {
                      error: false,
                      errorReason: null,
                      data: jsonData
                  }
                  resolve(response)
                })
        })
        .catch(error => {
          let response = {
              error: true,
              errorReason: error,
              data: null
          }
          reject(response)
        })
    })
  }
}

export default api