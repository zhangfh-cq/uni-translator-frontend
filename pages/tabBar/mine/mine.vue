<template>
	<view class="height-container">
		<!-- 提示激活邮箱 -->
		<uni-notice-bar single text="邮箱未激活,请点此激活邮箱" @click="toEmailActive" v-if="!userInfo.emailActive">
		</uni-notice-bar>
		<uni-section type="line" title="我的界面">
			<view class="height-container">
				<!-- 用户信息 -->
				<uni-card :title="userInfo.username" :sub-title="userInfo.email" extra="#" :thumbnail="avatar"
					@click="onClikcUserInfo">
					<text>{{userInfo.autograph}}</text>
				</uni-card>
				<!-- 修改信息 -->
				<uni-card @click="onClickModifyInfo">
					<text>修改信息</text>
				</uni-card>
				<!-- 注销账号 -->
				<uni-card @click="onClickLogOff">
					<text>注销账号</text>
				</uni-card>
				<!-- 退出登录 -->
				<uni-card @click="onClickSignOut">
					<text>退出登录</text>
				</uni-card>
				<!-- 关于程序 -->
				<uni-card @click="onClickAbout">
					<text>关于程序</text>
				</uni-card>
			</view>
		</uni-section>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: this.CONFIG.PATH.LOGO_IMAGE,
				userInfo: uni.getStorageSync(this.CONFIG.STORAGE.USER_INFO_NAME)
			}
		},
		onPullDownRefresh() {
			const self = this;
			self.utils.http.post({
				url: self.CONFIG.URLS.USER_INFO,
				success(res) {
					uni.stopPullDownRefresh();
					// 存储用户信息
					uni.setStorageSync(self.CONFIG.STORAGE.USER_INFO_NAME, res.data.data)
					// 更新用户信息
					self.userInfo = res.data.data;
				}
			});
		},
		methods: {
			toEmailActive() {
				uni.navigateTo({
					url: this.CONFIG.PATH.ACTIVE_EMAIL_PAGE,
				});
			},
			onClikcUserInfo() {
				uni.showModal({
					title: '提示',
					content: `账户注册时间:${this.userInfo.createTime}`,
					showCancel: false
				});
			},
			onClickModifyInfo() {
				uni.navigateTo({
					url: this.CONFIG.PATH.MODIFY_INFO_PAGE
				});
			},
			onClickSignOut() {
				const self = this;
				uni.showModal({
					title: '提示',
					content: '确定退出登录？',
					success(res) {
						if (res.confirm) {
							uni.clearStorageSync();
							uni.reLaunch({
								url: self.CONFIG.PATH.LOGIN_PAGE,
							});
						} else {
							console.log('操作取消');
						}
					}
				});
			},
			onClickLogOff() {
				uni.navigateTo({
					url: this.CONFIG.PATH.LOGOFF_PAGE,
				});
			},
			onClickAbout() {
				uni.showModal({
					title: '关于',
					content: '本程序前端基于uni-app+uni-ui，后端基于node.js+typescript+koa2+sequelize+mysql，为学习项目',
					showCancel: false
				});
			}
		}
	}
</script>

<style>
	@import url("/static/css/container.css");
</style>
