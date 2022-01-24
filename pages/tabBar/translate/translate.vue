<template>
	<view class="height-container">
		<!-- 语言选择 -->
		<uni-section type="line" title="语言选择">
			<uni-data-picker :localdata="fromLangList" v-model="fromLang" placeholder="请选择源语种"></uni-data-picker>
			<uni-data-picker :localdata="toLangList" v-model="toLang" placeholder="请选择目标语种"></uni-data-picker>
		</uni-section>

		<!-- 文本输入 -->
		<uni-section type="line" title="文本输入">
			<uni-easyinput type="textarea" v-model="inputText" @focus="showButton=true" @blur="showButton=false"
				placeholder="请输入待翻译文本"></uni-easyinput>
			<button type="primary" v-show="showButton" v-on:click="translate">提交翻译</button>
		</uni-section>

		<!-- 历史记录 -->
		<uni-section type="line" :title="historyTitle">
			<uni-swipe-action>
				<uni-swipe-action-item v-for="(item,index) in historyItems" :key="item.id" :right-options="item.options"
					:autoClose="false" v-on:click="onClickHistoryItem($event,index)">
					<view class="record-item">
						<text>{{`${item.originText} ${item.translation}`}}</text>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</uni-section>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fromLang: 'auto',
				toLang: 'en',
				fromLangList: this.CONFIG.LANG.FROM_LANG_LIST,
				toLangList: this.CONFIG.LANG.TO_LANG_LIST,
				inputText: '',
				showButton: false,
				historyArray: []
			}
		},
		computed: {
			historyTitle() {
				return `历史记录(${this.historyArray.length}/100)`;
			},
			historyItems() {
				const historyItems = [];
				this.historyArray.forEach((history, index) => {
					historyItems.push({
						id: index,
						options: [{
							text: '删除',
							style: {
								backgroundColor: 'rgb(255,58,49)'
							}
						}],
						originText: history.originText,
						translation: history.translation,
					});
				});
				return historyItems;
			}
		},
		created() {
			const self = this;
			uni.showLoading({
				title: '获取历史记录'
			});
			// 获取历史记录请求
			self.utils.http.post({
				url: self.CONFIG.URLS.GET_HISTORY,
				data: {
					start: 1,
					num: 100
				},
				success(res) {
					uni.setStorageSync(self.CONFIG.STORAGE.TRANSLATE_HISTORY_NAME, res.data.data);
					self.historyArray = res.data.data;
				},
				complete() {
					uni.hideLoading();
				}
			});
		},
		onShow() {
			const historyArray = uni.getStorageSync(this.CONFIG.STORAGE.TRANSLATE_HISTORY_NAME);
			this.historyArray = historyArray ? historyArray : [];
		},
		methods: {
			translate() {
				const self = this;
				// 翻译输入文本
				if (self.inputText) {
					uni.showLoading({
						title: '翻译中'
					});
					self.utils.http.post({
						url: self.CONFIG.URLS.TRNASLATE,
						data: {
							query: self.inputText,
							from: self.fromLang,
							to: self.toLang
						},
						success(res) {
							// 新增历史记录
							self.historyArray.unshift({
								originText: self.inputText,
								translation: res.data.data.translation
							});
							uni.setStorageSync(self.CONFIG.STORAGE.TRANSLATE_HISTORY_NAME, self.historyArray);
							uni.showModal({
								title: '译文',
								content: res.data.data.translation,
								showCancel: false
							});
						},
						complete() {
							uni.hideLoading();
						}
					});
				} else {
					uni.showToast({
						title: '文本不能为空',
						icon: 'error'
					});
				}
			},
			onClickHistoryItem(event, index) {
				const self = this;
				if (event.content.text === '删除') {
					uni.showModal({
						title: '提示',
						content: '确认删除该历史记录吗',
						success(res) {
							if (res.confirm) {
								uni.showLoading({
									title: '删除中'
								});
								// 删除历史记录网络请求 
								self.utils.http.post({
									url: self.CONFIG.URLS.DELETE_HISTORY,
									data: {
										originText: self.historyArray[index].originText,
										translation: self.historyArray[index]
											.translation
									},
									success(res) {
										// 本地删除
										self.historyArray.splice(index, 1);
										uni.setStorageSync(self.CONFIG.STORAGE.TRANSLATE_HISTORY_NAME, self
											.historyArray);
										uni.showToast({
											title: '删除成功'
										});
									},
									complete() {
										uni.hideLoading();
									}
								})
							} else {
								console.log('取消操作');
							}
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	@import url("/static/css/container.css");
	@import url("/static/css/record-item.css");
</style>
