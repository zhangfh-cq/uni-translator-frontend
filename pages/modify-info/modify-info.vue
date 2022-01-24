<template>
	<view class="height-container">
		<uni-forms ref="modifyForm" :rules="rules" :modelValue="formData">
			<uni-collapse @change="onCollapseChange">
				<!-- 修改用户名称 -->
				<uni-collapse-item title="修改用户名称" :open="true" :show-animation="true">
					<view class="form-item">
						<uni-forms-item label="新用户名称" name="newUsername">
							<uni-easyinput type="text" v-model="formData.newUsername" placeholder="请输入新用户名称">
							</uni-easyinput>
						</uni-forms-item>
					</view>
				</uni-collapse-item>
				<!-- 修改密码 -->
				<uni-collapse-item title="修改密码" :open="true" :show-animation="true">
					<view class="form-item">
						<uni-forms-item label="当前密码" name="password">
							<uni-easyinput type="password" v-model="formData.password" placeholder="请输入当前密码">
							</uni-easyinput>
						</uni-forms-item>
						<uni-forms-item label="新的密码" name="newPassword">
							<uni-easyinput type="password" v-model="formData.newPassword" placeholder="请输入新密码">
							</uni-easyinput>
						</uni-forms-item>
						<uni-forms-item label="确认新密码" name="newPasswordConfirm">
							<uni-easyinput type="password" v-model="formData.newPasswordConfirm" placeholder="请确认新密码">
							</uni-easyinput>
						</uni-forms-item>
					</view>
				</uni-collapse-item>
				<!-- 修改邮箱地址 -->
				<uni-collapse-item title="修改邮箱地址" :open="true" :show-animation="true">
					<view class="form-item">
						<uni-forms-item label="邮箱地址" name="newEmail">
							<uni-easyinput type="text" v-model="formData.newEmail" placeholder="请输入新邮箱地址">
							</uni-easyinput>
						</uni-forms-item>
					</view>
				</uni-collapse-item>
				<!-- 修改签名 -->
				<uni-collapse-item title="修改签名" :open="true" :show-animation="true">
					<view class="form-item">
						<uni-forms-item label="修改签名" name="newAutograph">
							<uni-easyinput type="text" v-model="formData.newAutograph" placeholder="请输入新签名">
							</uni-easyinput>
						</uni-forms-item>
					</view>
				</uni-collapse-item>
			</uni-collapse>
			<uni-forms-item>
				<button type="primary" @click="modifyInfo">修改信息</button>
			</uni-forms-item>
		</uni-forms>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					newUsername: '',
					password: '',
					newPassword: '',
					newPasswordConfirm: '',
					newEmail: '',
					newAutograph: ''
				},
				modifyItems: {
					username: false,
					password: false,
					email: false,
					autograph: false
				},
				rules: {}
			}
		},
		methods: {
			onCollapseChange(event) {
				let self = this;
				// 修改项默认false
				for (let item in self.modifyItems) {
					self.modifyItems[item] = false;
				}
				// 遍历Change事件数组拿到当前修改项
				event.forEach((item) => {
					switch (item) {
						case '0':
							self.modifyItems.username = true;
							break;
						case '1':
							self.modifyItems.password = true;
							break;
						case '2':
							self.modifyItems.email = true;
							break;
						case '3':
							self.modifyItems.autograph = true;
							break;
					}
				});

				// 根据修改项更改校验规则
				// 是否修改用户名称
				if (self.modifyItems.username) {
					self.rules.newUsername = self.CONFIG.RULES.USERNAME;
				} else {
					self.rules.newUsername = {}
				}
				// 是否修改密码
				if (self.modifyItems.password) {
					self.rules.password = self.CONFIG.RULES.PASSWORD;
					self.rules.newPassword = self.CONFIG.RULES.PASSWORD;
					self.rules.newPasswordConfirm = self.CONFIG.RULES.NEW_PASSWORD_CONFIRM;
				} else {
					self.rules.password = {}
					self.rules.newPassword = {}
					self.rules.newPasswordConfirm = {}
				}
				// 是否修改邮箱
				if (self.modifyItems.email) {
					self.rules.newEmail = self.CONFIG.RULES.EMAIL;
				} else {
					self.rules.newEmail = {}
				}
				// 是否修改签名
				if (self.modifyItems.autograph) {
					self.rules.newAutograph = self.CONFIG.RULES.AUTOGRAPH;
				} else {
					self.rules.newAutograph = {}
				}
				// 重置组件校验规则
				self.$refs.modifyForm.init(self.rules);
			},
			modifyInfo() {
				let self = this;
				self.$refs.modifyForm.validate().then(res => {
					uni.showLoading({
						title: '修改提交中'
					});
					// 发起信息修改请求
					self.utils.http.post({
						url: self.CONFIG.URLS.USER_MODIFY,
						data: {
							username: {
								isModify: self.modifyItems.username,
								newUsername: self.formData.newUsername
							},
							password: {
								isModify: self.modifyItems.password,
								oldPassword: self.utils.md5(self.formData.password),
								newPassword: self.utils.md5(self.formData.newPassword)
							},
							email: {
								isModify: self.modifyItems.email,
								newEmail: self.formData.newEmail
							},
							autograph: {
								isModify: self.modifyItems.autograph,
								newAutograph: self.formData.newAutograph
							}
						},
						success(res) {
							uni.showModal({
								title: '提示',
								content: '修改成功',
								showCancel: false,
								success() {
									// 如果修改了密码
									if (self.modifyItems.password) {
										uni.removeStorageSync(self.CONFIG.STORAGE.TOKEN_NAME);
										// 重新登录
										uni.reLaunch({
											url: self.CONFIG.PATH.LOGIN_PAGE
										});
									} else {
										uni.navigateBack();
										uni.startPullDownRefresh();
									}
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
			}
		}
	}
</script>

<style>
	@import url("/static/css/container.css");

	.form-item {
		padding: 20rpx;
	}
</style>
