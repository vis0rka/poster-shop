let load_num = 4;
let watcher;

new Vue({
	el: "#app",
	data: {
		total: 0,
		products: [],
		cart: [],
		search: "cat",
		lastSearch: "",
		loading: false,
		results: [],
	},
	methods: {
		addToCart: function (product) {
			this.total += product.price;
			let found = false;
			for (let i = 0; i < this.cart.length; i++) {
				if (this.cart[i].id === product.id) {
					this.cart[i].qty++;
					found = true;
				}
			}
			if (!found) {
				this.cart.push({
					id: product.id,
					title: product.title,
					price: product.price,
					qty: 1
				});
			}
		},
		onSubmit: function () {
			this.products = [];
			this.results = [];
			this.loading = true;
			let path = `/search?q=${this.search}`;
			this.$http.get(path)
				.then(response => {
					this.results = response.body;
					this.lastSearch = this.search;
					this.appendResult();
					this.loading = false;
				})
		},
		appendResult: function () {
			if (this.products.length < this.results.length) {
				let toAppend = this.results.slice(
					this.products.length,
					load_num + this.products.length
				);
				this.products = this.products.concat(toAppend)
			}
		}
	},
	filters: {
		currency: function (price) {
			return `$${price.toFixed(2)}`
		}
	},
	created: function () {
		this.onSubmit();
	},
	updated() {
		let sensor = document.querySelector("#product-list-bottom");
		watcher = scrollMonitor.create(sensor);
		watcher.enterViewport(this.appendResult);
	},
	beforeUpdate() {
		if (watcher) {
			watcher.destroy();
			watcher = null;
		}
	},
});

