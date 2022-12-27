const path = require('path');

module.exports = {
	
	entry: './src/js/index.js',
	resolve: {
		extensions: ['.webpack.js', '.js']
	},
	mode: 'development', 
	output: {
		filename: '[name].build.js',
		path: path.join(__dirname, 'js')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/env']
					}
				}
			},
			{
				test: /\.(glb|gltf)$/,
				use:
          [
          	{
          		loader: 'file-loader',
          		options:
                  {
                  	outputPath: 'assets/models/'
                  }
          	}
          ]
			},
		]
	}
};
