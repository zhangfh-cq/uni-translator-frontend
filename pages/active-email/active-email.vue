<template>
	<view class="center-container">
		<view class="width-container">
			<uni-forms ref="activeEmailForm" :rules="rules" :modelValue="formData">
				<uni-forms-item label="邮箱验证码" name="verifyCode">
					<uni-easyinput type="text" v-model="formData.verifyCode" placeholder="请输入邮箱验证码"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item>
					<button type="primary" :disabled="disabledSendButton"
						@click="onClickSendCode">{{sendButtonText}}</button>
				</uni-forms-item>
				<uni-forms-item>
					<button type="primary" @click="onClickSubmitCode">提交验证码</button>
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
					verifyCode: '',
				},
				rules: {
					verifyCode: this.CONFIG.RULES.EMAIL_VERIFY_CODE
				},
				disabledSendButton: false,
				sendButtonText: '发送验证码'
			}
		},
		methods: {
			onClickSendCode() {
				const self = this;
				uni.showLoading({
					title: '邮件发送中'
				});
				// 发送邮箱验证码
				self.utils.http.post({
					url: self.CONFIG.URLS.EMAIL_ACITVE,
					success(res) {
						// 禁用按钮倒计时
						let waitTime = 60;
						self.disabledSendButton = true;
						const waitTimer = setInterval(() => {
							waitTime -= 1;
							self.sendButtonText = `重新发送验证码(${waitTime})`;
						}, 1000);
						setTimeout(function() {
							clearInterval(waitTimer);
							self.disabledSendButton = false;
							self.sendButtonText = `重新发送验证码`;
						}, 60 * 1000);
					},
					complete() {
						uni.hideLoading();
					}
				});
			},
			onClickSubmitCode() {
				const self = this;
				self.$refs.activeEmailForm.validate().then(res => {
					uni.showLoading({
						title: '提交中'
					});
					// 提交验证码
					self.utils.http.post({
						url: self.CONFIG.URLS.EMAIL_CODE_VERIFY,
						data: {
							code: this.formData.verifyCode
						},
						success(res) {
							// 更新用户信息
							const userInfo = uni.getStorageSync(self.CONFIG.STORAGE.USER_INFO_NAME);
							userInfo.emailActive = 1;
							uni.setStorageSync(self.CONFIG.STORAGE.USER_INFO_NAME, userInfo);
							uni.showModal({
								title: '提示',
								content: '邮箱激活成功',
								showCancel: false,
								complete() {
									uni.navigateBack();
									uni.startPullDownRefresh();
								}
							});
						},
						complete() {
							uni.hideLoading();
						}
					});
				}).catch(error => {
					console.log('错误信息：', error);
				});
				// 提交验证码
			}
		}
	}
</script>

<style>
	@import url("/static/css/container.css");
</style>
