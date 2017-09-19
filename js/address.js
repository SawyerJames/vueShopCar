var vm = new Vue({
	el: '.container',
	data: {
		addressList: [],
		limitNumber: 3,
		currentIndex: 0,
		shippingMethod: 1
	},
	mounted: function (){
		this.$nextTick(function (){
			this.getAddressList();
		});
	},
	computed:{
		filterAddress: function (){
			return this.addressList.slice(0, this.limitNumber);
		}
	},
	methods: {
		getAddressList: function (){
			// 加载数据
            axios.get("data/address.json").then(res => {
            	var resData = res.data;
            	// 判断状态码
                if (resData.status == "0") {
                	this.addressList = res.data.result;
                }
            });
		},
		loadMore: function (){
			// 如果长度为3，就展示所有
			if (this.limitNumber == 3) {
				this.limitNumber = this.addressList.length;
			}
			// 如果长度不为3，就设为3
			else{
				this.limitNumber = 3;
			}
		},
		current: function (index){
			// 通过for的index参数，加点击事件获取到当前点击的索引值
			this.currentIndex = index;
		},
		setDefault: function (addressId){
			// 传过来的id和列表中所有id进行判断并遍历
			this.addressList.forEach(function (address,index){
				// 如果id一样，就将默认地址设为true
				if (address.addressId == addressId) {
					address.isDefault = true;
				}
				// 其他的id肯定遍历后都不一样，将isDefault都改为false
				else{
					address.isDefault = false;
				}
			})
		}
	}
});