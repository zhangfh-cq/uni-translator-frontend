const BASE_URL = 'http://localhost:8080';

const URLS = {
	USER_LOGIN: `${BASE_URL}/user/login`,
	USER_SIGNUP: `${BASE_URL}/user/signup`,
	USER_INFO: `${BASE_URL}/user/info`,
	USER_MODIFY: `${BASE_URL}/user/modify`,
	USER_LOGOFF: `${BASE_URL}/user/logoff`,
	EMAIL_ACITVE: `${BASE_URL}/user/email/active`,
	EMAIL_CODE_VERIFY: `${BASE_URL}/user/email/verify`,
	TRNASLATE: `${BASE_URL}/translate`,
	GET_HISTORY: `${BASE_URL}/history/get`,
	DELETE_HISTORY: `${BASE_URL}/history/delete`,
	GET_NEW_WORD: `${BASE_URL}/new-word/get`,
	DELETE_NEW_WORD: `${BASE_URL}/new-word/delete`,
}

export default URLS;
