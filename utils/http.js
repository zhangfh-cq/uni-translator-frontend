import CONFIG from '@/config/config.js';

// POST请求方法
function post(postParam = {
	url,
	header,
	data,
	success,
	resFail,
	fail,
	complete,
}, needToken = true) {
	const uni = CONFIG.UNI;
	// 判断是否需要TOKEN
	if (needToken) {
		const TOKEN = uni.getStorageSync(CONFIG.STORAGE.TOKEN_NAME);
		// 判断TOKEN是否获取
		if (TOKEN) {
			postParam.header = typeof postParam.header === 'object' ? postParam.header : {};
			Object.assign(postParam.header, {
				'authorization': TOKEN
			});
		} else {
			// 跳转登录
			uni.showModal({
				title: '提示',
				content: '身份验证失败，请重新登录',
				showCancel: false,
				complete() {
					uni.reLaunch({
						url: CONFIG.PATH.LOGIN_PAGE,
					});
				}
			});
		}
	}

	// 发起POST请求 
	uni.request({
		url: postParam.url,
		method: 'POST',
		header: postParam.header,
		data: postParam.data,
		success(res) {
			if (res.data && typeof res.data.code) {
				if (res.data.code === CONFIG.RESPONSE.SUCCESS_CODE) {
					postParam.success(res);
				} else if (res.data.code === CONFIG.RESPONSE.TOKEN_EXPIRED_CODE ||
					res.data.code === CONFIG.RESPONSE.TOKEN_INVALID_CODE) {
					// TOKEN无效或过期，跳转登录
					uni.removeStorageSync(CONFIG.STORAGE.TOKEN_NAME);
					uni.showModal({
						title: '提示',
						content: '登录凭证失效或过期，请重新登录',
						showCancel: false,
						complete() {
							uni.reLaunch({
								url: CONFIG.PATH.LOGIN_PAGE,
							});
						}
					});
				} else {
					console.log(res.data);
					uni.showModal({
						title: '提示',
						content: res.data.msg,
						showCancel: false,
						complete() {
							if (postParam.resFail) {
								postParam.resFail(res.data);
							}
						}
					});
				}
			} else {
				uni.showModal({
					title: '提示',
					content: '服务器响应错误，请稍后再试',
					showCancel: false
				});
			}
		},
		fail(res) {
			console.log(res.errMsg);
			uni.showModal({
				title: '提示',
				content: '网络请求失败，请稍后再试',
				showCancel: false,
				complete() {
					postParam.fail(res);
				}
			});
		},
		complete(res) {
			if (postParam.complete) {
				postParam.complete(res);
			}
		}
	});
}

const http = {
	post: post
}

export default http;
