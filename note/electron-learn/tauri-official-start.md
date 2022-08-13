# tauri官方文档阅读

## 安装

第一步是安装rust和系统依赖。注意：只有开发者的机器上需要安装，最终用户上不需要安装。

### 设置macOS

1、C语言和macOS开发依赖

```bash
xcode-select --install
```

2、Rust

```bash
curl --proto 'https' -tlsv1.2 https://sh.rustup.rs -sSf | sh
```

该脚本会安装rustup相关工具。

### 升级或卸载

Tauri和它的组件可以通过修改Cargo.toml来升级。或者直接运行cargo upgrade命令来升级。

```bash
# upgrade
cargo upgrade
# update rustup
rustup update
# uninstall rustup
rustup self uninstall
```

### 查看当前版本

```bash
rustc --version
# rustc x.y.z(commitid yyyy-mm-dd)
```


## 参考文档

https://tauri.app/v1/guides/getting-started/prerequisites