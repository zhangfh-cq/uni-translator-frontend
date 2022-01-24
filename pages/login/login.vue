<template>
	<view class="center-container">
		<view class="width-container">
			<view class="logo-box">
				<image :src="logoPath" class="logo"></image>
			</view>
			<uni-forms ref="loginForm" v-bind:rules="rules" v-bind:modelValue="formData">
				<uni-forms-item label="邮箱地址" name="email">
					<uni-easyinput type="text" v-model="formData.email" placeholder="请输入邮箱地址"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="用户密码" name="password">
					<uni-easyinput type="password" v-model="formData.password" placeholder="请输入用户密码"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item>
					<button type="primary" v-on:click="login">立即登录</button>
				</uni-forms-item>
				<uni-forms-item>
					<button type="primary" v-on:click="toSignUp">注册账号</button>
				</uni-forms-item>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logoPath:this.CONFIG.PATH.LOGO_IMAGE,
				formData: {
					email: '',
					password: '',
				},
				rules: {
					email: this.CONFIG.RULES.EMAIL,
					password: this.CONFIG.RULES.PASSWORD
				}
			}
		},
		onLoad() {
			if (uni.getStorageSync(this.CONFIG.STORAGE.TOKEN_NAME)) {
				uni.switchTab({
					url: this.CONFIG.PATH.TRANSLATE_PAGE,
				});
			}
		},
		methods: {
			login() {
				const self = this;
				self.$refs.loginForm.validate().then(res => {
					uni.showLoading({
						title: '登录中'
					});
					// 登录网络请求
					self.utils.http.post({
						url: self.CONFIG.URLS.USER_LOGIN,
						data: {
							email: self.formData.email,
							password: self.utils.md5(self.formData.password)
						},
						success(res) {
							// 存储TOKEN
							uni.setStorageSync(self.CONFIG.STORAGE.TOKEN_NAME, res.data.data
								.token);
							uni.showLoading({
								title: '获取信息中'
							});
							// 获取用户信息请求
							self.utils.http.post({
								url: self.CONFIG.URLS.USER_INFO,
								success(res) {
									// 存储用户信息
									uni.setStorageSync(self.CONFIG.STORAGE.USER_INFO_NAME,
										res.data
										.data);
									// 跳转到翻译界面
									uni.switchTab({
										url: self.CONFIG.PATH.TRANSLATE_PAGE
									});
								},
								complete(res) {
									uni.hideLoading();
								}
							});
						},
						complete(res) {
							uni.hideLoading();
						}
					}, false);
				}).catch(error => {
					console.log('错误信息：', error);
				});
			},
			toSignUp() {
				uni.navigateTo({
					url: this.CONFIG.PATH.SIGNUP_PAGE
				});
			}
		}
	}
</script>

<style>
	@import url("/static/css/container.css");
	@import url("/static/css/logo.css");
</style>
