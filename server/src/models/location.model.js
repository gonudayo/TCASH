const locationStore = new Map();

const LocationModel = {
  /**
   * 유저의 새로운 위치 추가
   * @param {string} id - 소켓 ID
   * @param {object} coords - { lat, lng, timestamp }
   */
  addLocation: (id, coords) => {
    if (!locationStore.has(id)) {
      locationStore.set(id, []);
    }
    const history = locationStore.get(id);
    history.push(coords);

    if (history.length > 1000) {
      history.shift(); // 가장 오래된 기록 삭제
    }
  },

  /**
   * 특정 유저의 이동 경로(History) 전체 조회
   */
  getHistory: (id) => {
    return locationStore.get(id) || [];
  },

  /**
   * 모든 유저의 마지막 좌표 조회
   */
  getAllLastLocations: () => {
    const result = {};
    locationStore.forEach((history, id) => {
      if (history.length > 0) {
        result[id] = history[history.length - 1];
      }
    });
    return result;
  },

  removeUser: (id) => {
    locationStore.delete(id);
  },
};

module.exports = LocationModel;
