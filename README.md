# リアルタイム家計簿ファイブマン

リアルタイム家計簿ファイブマンは作者の急迫する家計を支えるために作成されたリアルタイムオンライン家計簿です。開発する際に目標としたのは、オンラインで同時に家計簿編集を想定されていることと、入力までのステップが少ないことです。個人的な利用を完全に想定されているため、普通の家計簿には存在してはいけない独自仕様が盛り込まれています。それらの例を上げます。

- 家計簿をオンラインで公開する

 この家計簿はオンラインで公開することを想定しています。

- セキュリティ保護をしない

 この家計簿はオンラインに公開されていること、誰でも編集ができることが想定されています。その代わり、変更された場合そのデータの変更がすぐにわかるようになっています。

- ログインはない

 誰が編集したかということを記録しません。

- キーテクノロジー

 高度に難読化されたコードは読む気を失せさせ、攻撃の可能性は極端に減ります。また、そもそもセキュリティが存在していないため、攻撃という概念も無くなりました。まさにコロンブスの卵でございます。コードは絡み合って爆発していますが、実行速度だけは早くなるように改良し続けています。
 真面目なことを書くと、socket.ioを使い編集データをクライアント間で同期します。また無駄な転送を抑えるため、jsonの差分データでやり取りを行います。キャッシュとローカルストレージ及びウェブサーバーの圧縮転送を有効にすれば、ストレスフリーに限りなく近い（気分の）操作感で家計簿をつけることが可能です。実際に作者が使い続けています。


## スクリーンショット

### メインメニュー
![1](https://user-images.githubusercontent.com/9710707/87123852-88a24000-c2c2-11ea-9ede-40b471b92259.png)

### 支出内訳表示
![2](https://user-images.githubusercontent.com/9710707/87123857-8a6c0380-c2c2-11ea-9438-6b5467b45eb4.png)

### ipadなどからの入力にも対応
![3](https://user-images.githubusercontent.com/9710707/87123862-8b049a00-c2c2-11ea-96e5-bed6c95d4550.png)


## お詫び

現在まで３年ほど個人的に利用をしていますが、あちこちバグだらけです。致命的なものもいくつかありますが、再ロードでどうにかなる場合は放置されている可能性があります。困ったらブラウザを再ロードしてみてください。

## インストール

    npm install

node_module以下に必要なパッケージがインストールされたあと、gulpによってpublic/以下に必要なパッケージからのソースコードがコピー・圧縮されます。この作業は時間がかかります。（２分程度）

## 起動テスト

    npm test

デーモンとしてではなく、コンソールでサーバーを起動します。CTRL-Cで終了できます。

## 接続テスト

ブラウザから<http://localhost:3002/>へアクセスしてください。初めの金額を送信すれば家計簿が始まります。この初めの最も古い日付の入力は表に表示されないようになっています。
家計簿の名前等を変更したい場合は直接/book/note.jsonを編集してください。編集後サーバーを再起動してください。

## 起動

    npm start

foreverを使ってデーモンとして起動します。

### Expressを使わない場合
    
上記の方法で起動すると静的コンテンツをnodeパッケージのexpressによりホスティングする設定になっています。apache等のソフトウェアからホスティングする場合は

    npm run start-without-express

にて起動してください。その場合はpublic/以下及びbook/を外部からアクセス出来るよう設定を行ってください。

## 停止

    npm stop


## 使い方

家計簿の書き込みを行うためには（ファ）（イ）（ブ）（マ）（ン）とあるタイトルを順番にクリックすると新規の追加が出来る状態になれます。

## コンテナによる起動

コンテナを用いて起動するとサーバーの環境構築が自動化され簡潔に利用することが可能です。

### 前準備

後からbook/note.jsonを編集するためにコンテナ内で作業するのを省くために、コンテナを作成する前に上の起動テストを行い、book/note.jsonを作成し、これを

    vim book/note.json

などでタイトルなどの初期設定をしておいてください。すでにタイトルなどを設定済みの場合はこの準備は必要ありません。

### コンテナの起動方法

コンテナの作成方法は２種類あります。

1. docker-compose.ymlを使用してnginxとsockerioサーバーの計２種類のコンテナを起動する方法
2. Dockerfileのみを用いてexpressを利用してappのみのスタンドアローンなコンテナを作る方法

nginxで静的ホスティングを利用するほうが若干パフォーマンスが良いと思われます。

### 1.の方法を利用する場合

docker-composeの環境が整っていれば

	docker-compose build
	docker-compose up

で起動します。http://localhost/にアクセスしてください。
止めるには

	docker-compose stop

またはコンテナの停止

	docker-compose down　

が利用できます。コンテナを停止してもボリュームが残るため新しく始める場合は消してください。

### 2.の方法を利用する場合

2.の方法を利用する場合は続くDockerコンテナの作成をご覧ください。

## Dockerコンテナを作成(スタンドアローンなコンテナの作成)

Dockerfileを利用して起動する場合を説明します。(note.jsonの前準備が必要です。）

### コンテナの作成

    docker build --build-arg PORT=3002 -t (ユーザー名)/fiveman .

build-argはポートを指定するオプションです。指定しなかった場合3002が使われます。

## Dockerコンテナの起動

作成したDockerコンテナを起動するには次のようにします。

    docker run -v fiveman_vol:/usr/src/app/book/ -p 8080:3002 -d (ユーザー名)/fiveman:latest

-p オプションでポートの設定をします。この設定は

    (外部に公開するポート番号):(上で指定したPORT番号)

を意味しています。

-v はデータ永続化のためのボリュームを指定しています。このオプションをつけることで、コンテナ内の家計簿のデーター/book/note.jsonは永続化されます。fiveman_volはボリューム名なので任意の名前を指定できます。このオプションがない場合はコンテナ停止・起動でデータが初期化されますので家計簿が消えることに注意してください。

## Dockerコンテナの停止

    docker ps
    
で稼働中のコンテナのIDを調べて、そのIDを元に

    docker stop (container id)

で停止させることが出来ます。

## Licenceについて

この家計簿本体はApache-2.0のライセンスのもとで公開します。
この家計簿はMIT, Apache-2.0及びCC BY-NC3.0のライセンスのもとで公開されているオープンソースのコードを含みます。それぞれのコードのライセンスの一覧についてはpublic/js/index.jsより確認できます。canvas.jsについては現在商用ライセンスで公開されていますが、この家計簿では古いCC BY-NC 3.0のものを利用しています。したがってこの家計簿を商用利用することはできません。

## 作者

Hideto Manjo
