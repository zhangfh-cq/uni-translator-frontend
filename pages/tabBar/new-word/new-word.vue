<template>
	<view class="height-container">
		<uni-section type="line" :title="newWordTitle">
			<uni-swipe-action>
				<uni-swipe-action-item v-for="(item,index) in newWordItems" :key="item.id" :right-options="item.options"
					:autoClose="false" @click="onClickNewWordItem($event,index)">
					<view class="record-item">
						<text>{{`${item.word} ${item.translation}`}}</text>
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
				newWordArray: [],
			}
		},
		computed: {
			newWordTitle() {
				return `生词记录(${this.newWordArray.length}/100)`
			},
			newWordItems() {
				const newWordItems = [];
				this.newWordArray.forEach((newWord, index) => {
					newWordItems.push({
						id: index,
						options: [{
							text: '删除',
							style: {
								backgroundColor: 'rgb(255,58,49)'
							}
						}],
						word: newWord.word,
						translation: newWord.translation
					});
				});
				return newWordItems;
			}
		},
		onPullDownRefresh() {
			const self = this;
			self.utils.http.post({
				url: self.CONFIG.URLS.GET_NEW_WORD,
				data: {
					start: 1,
					num: 100
				},
				success(res) {
					uni.setStorageSync(self.CONFIG.STORAGE.NEW_WORD_NAME, res.data.data);
					self.newWordArray = res.data.data;
				},
				complete() {
					uni.stopPullDownRefresh();
				}
			});
		},
		created() {
			uni.startPullDownRefresh();
		},
		onShow() {
			const newWordArray = uni.getStorageSync(this.CONFIG.STORAGE.NEW_WORD_NAME);
			this.newWordArray = newWordArray ? newWordArray : [];
		},
		methods: {
			onClickNewWordItem(event, index) {
				const self = this;
				if (event.content.text === '删除') {
					uni.showModal({
						title: '提示',
						content: '确认删除该生词记录吗？',
						success(res) {
							if (res.confirm) {
								uni.showLoading({
									title: '删除中'
								});
								// 云端删除生词记录
								self.utils.http.post({
									url: self.CONFIG.URLS.DELETE_NEW_WORD,
									data: {
										word: self.newWordArray[index].word
									},
									success: (res) => {
										// 本地删除
										self.newWordArray.splice(
											index, 1);
										uni.setStorageSync(self.CONFIG.STORAGE.NEW_WORD_NAME, self
											.newWordArray);
										uni.showToast({
											title: '删除成功'
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
				}
			}
		}
	}
</script>

<style lang="scss">
	@import url("/static/css/container.css");
	@import url("/static/css/record-item.css");
</style>
