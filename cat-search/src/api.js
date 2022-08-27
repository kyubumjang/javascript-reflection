export const END_POINT =
  'https://kdt-frontend.cat-search-api.programmers.co.kr/api/cats';

export const request = async (url) => {
  try {
    const res = await fetch(`${END_POINT}${url}`);
    if (!res.ok) {
      throw new Error('API 호출에 실패했습니다.');
    }
    return await res.json();
  } catch (e) {
    alert(e.message);
  }
};
