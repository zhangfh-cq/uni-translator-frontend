const RULES = {
	USERNAME: {
		rules: [{
				required: true,
				errorMessage: '用户名称不能为空'
			},
			{
				minLength: 1,
				maxLength: 12,
				errorMessage: '用户名称长度必须在{minLength}到{maxLength}之间'
			}
		]
	},
	PASSWORD: {
		rules: [{
				required: true,
				errorMessage: '用户密码不能为空'
			},
			{
				minLength: 6,
				maxLength: 16,
				errorMessage: '用户密码长度必须在{minLength}到{maxLength}之间'
			},
		]
	},
	PASSWORD_CONFIRM: {
		rules: [{
				required: true,
				errorMessage: '确认密码不能为空'
			},
			{
				validateFunction(rule, value, data, callback) {
					if (value === data.password) {
						callback();
					} else {
						callback('两次密码输入不一致');
					}
				}
			}
		]
	},
	NEW_PASSWORD_CONFIRM: {
		rules: [{
				required: true,
				errorMessage: '确认密码不能为空'
			},
			{
				validateFunction(rule, value, data, callback) {
					if (value === self.newPassword) {
						callback();
					} else {
						callback('两次新密码密码输入不一致');
					}
				}
			}
		]
	},
	EMAIL: {
		rules: [{
			required: true,
			errorMessage: '邮箱地址不能为空'
		}, {
			format: 'email',
			errorMessage: '邮箱地址格式不正确',
		}]
	},
	EMAIL_VERIFY_CODE: {
		rules: [{
				required: true,
				errorMessage: '验证码不能为空'
			},
			{
				minLength: 6,
				maxLength: 6,
				errorMessage: '验证码长度只能为{maxLength}'
			}
		]
	},
	AUTOGRAPH: {
		rules: [{
				required: true,
				errorMessage: '签名不能为空'
			},
			{
				minLength: 1,
				maxLength: 20,
				errorMessage: '签名长度必须在{minLength}到{maxLength}之间'
			}
		]
	}
}

export default RULES;