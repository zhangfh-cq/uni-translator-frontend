<template>
	<view class="center-container">
		<view class="width-container">
			<uni-forms ref="logoffForm" :rules="rules" :modelValue="formData">
				<uni-forms-item label="输入密码" name="password">
					<uni-easyinput type="password" v-model="formData.password" placeholder="请输入密码确认操作"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item>
					<button type="warn" @click="onClickLogoff">注销用户</button>
				</uni-forms-item>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					password: ''
				},
				rules: {
					password: this.CONFIG.RULES.PASSWORD
				}
			}
		},
		methods: {
			onClickLogoff() {
				const self = this;
				self.$refs.logoffForm.validate().then(res => {
					uni.showModal({
						title: '提示',
						content: '此操作不可逆，是否确认注销？',
						success(res) {
							if (res.confirm) {
								uni.showLoading({
									title: '注销中'
								});
								// 发送注销请求
								self.utils.http.post({
									url: self.CONFIG.URLS.USER_LOGOFF,
									data: {
										password: self.utils.md5(self.formData.password)
									},
									success(res) {
										uni.showModal({
											title: '提示',
											content: '注销成功',
											complete() {
												// 移除本地缓存
												uni.clearStorageSync();
												// 重定向到登录
												uni.reLaunch({
													url: self.CONFIG.PATH
														.LOGIN_PAGE
												});
											}
										});
									},
									complete() {
										uni.hideLoading();
									}
								});
							} else {
								console.log('取消操作');
							}
						}
					});
				}).catch(error => {
					console.log('错误信息：', error);
				});
			}
		}
	}
</script>

<style>
	@import url("/static/css/container.css");
</style>
