<template>
	<view class="center-container">
		<view class="width-container">
			<view class="logo-box">
				<image :src="logoPath" class="logo"></image>
			</view>
			<uni-forms ref="signUpForm" :rules="rules" :modelValue="formData">
				<uni-forms-item label="用户名称" name="username">
					<uni-easyinput type="text" v-model="formData.username" placeholder="请输入用户名称"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="用户密码" name="password">
					<uni-easyinput type="password" v-model="formData.password" placeholder="请输入用户密码"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="确认密码" name="passwordConfirm">
					<uni-easyinput type="password" v-model="formData.passwordConfirm" placeholder="请再次输入密码">
					</uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="邮箱地址" name="email">
					<uni-easyinput type="text" v-model="formData.email" placeholder="请输入邮箱地址"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item>
					<button type="primary" @click="signup">立即注册</button>
				</uni-forms-item>
				<uni-forms-item>
					<button type="default" @click="backLogin">返回登录</button>
				</uni-forms-item>
			</uni-forms>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				logoPath: this.CONFIG.PATH.LOGO_IMAGE,
				formData: {
					username: '',
					password: '',
					passwordConfirm: '',
					email: ''
				},
				rules: {
					username: this.CONFIG.RULES.USERNAME,
					password: this.CONFIG.RULES.PASSWORD,
					passwordConfirm: this.CONFIG.RULES.PASSWORD_CONFIRM,
					email: this.CONFIG.RULES.EMAIL
				}
			}
		},
		methods: {
			signup() {
				const self = this;
				self.$refs.signUpForm.validate().then(res => {
					uni.showLoading({
						title: '注册中'
					});
					// 注册网络请求
					self.utils.http.post({
						url: self.CONFIG.URLS.USER_SIGNUP,
						data: {
							username: self.formData.username,
							password: self.utils.md5(self.formData.password),
							email: self.formData.email
						},
						success(res) {
							uni.showModal({
								title: '提示',
								content: '注册成功',
								showCancel: false,
								complete() {
									uni.navigateBack();
								}
							});
						},
						complete() {
							uni.hideLoading();
						}
					}, false);
				}).catch(error => {
					console.log('错误信息：', error);
				});
			},
			backLogin() {
				uni.navigateBack();
			}
		}
	}
</script>

<style>
	@import url("/static/css/container.css");
	@import url("/static/css/logo.css");
</style>
