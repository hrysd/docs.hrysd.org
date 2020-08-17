---
layout: post
title: ThinkPad X280 に Gentoo Linux を入れる時のメモ
date: 2020-08-18 00:30
categories: Gentoo
---

## 🚧注意🚧

この記事は手元のなぐり書きを整形しただけの記事のため、この通りに実行してもインストールできるかは保証できません。
週末あたりにインストール予定なのでその結果次第でこの記事を更新します。

## 必要なもの

- USBメモリ
  - SystemRescueCd 用
  - http://www.system-rescue-cd.org/Download/
  - なにかと便利なのでリモートのお供に一家に一本

```
$ lsblk # デバイス名の確認
$ dd if=systemrescuecd-x.y.z.iso of=/dev/DEVICE
```

## 事前準備

- SecureBoot を無効にする
  - BIOS の画面から SecureBoot を無効にする
  - カーネルのイメージに署名がない
- LAN ケーブル
  - WIFI に接続するのが面倒なので

## ディスクの準備

SystemRescueCd の入った USBメモリをさし、USBメモリから起動する。
パーティションを作っていく。 NVME 接続なストレージなためデバイス名がすごい.

```
$ gdisk /dev/nvme0n1
o # 全消し

# boot 領域
n
1
↩️
+512M
EF00

# swap 領域
n
2
↩️
+8G
8200

# root パーティション
n
3
↩️
↩️
↩️
```

次にファイルシステム。

```
$ mkfs.vfat -F 32 /dev/nvme0n1p1 # boot
$ mkswap /dev/nvme0n1p2 # swap
$ swapon /dev/nvme0n1p2 # swap
$ mkfs.ext4 /dev/nvme0n1p3 # root
```

## stage3 tarball をダウンロードしてマウントする

root パーティションをマウントし tarball  をダウンロード・展開してく。[このあたり](https://www.gentoo.org/downloads/) から選択、ダウンロードする。事前に短縮 URL にしとくと便利。

```
# mkdir /mnt/gentoo
# mount /dev/nvme0n1p3 /mnt/gentoo
# mkdir -p /mnt/gentoo/boot/efi
# mount /dev/nvme0n1p1 /mnt/gentoo/boot/efi
# cd /mnt/gentoo
# wget -O stage3.tar.bz2 URL
# tar xpvf stage3.tar.bz2 --xattrs-include='*.*' --numeric-owner
```

chroot する。

```
# mount --types proc /proc /mnt/gentoo/proc
# mount --rbind /sys /mnt/gentoo/sys
# mount --make-rslave /mnt/gentoo/sys
# mount --rbind /dev /mnt/gentoo/dev
# mount --make-rslave /mnt/gentoo/dev
# chroot /mnt/gentoo /bin/bash
# source /etc/profile
# export PS1="(chroot) ${PS1}"
```

## カーネルのビルド

いくつかファイルを編集しつつカーネルのビルドの準備をしていく。

```
# nano -w /etc/fstab
# nano -w /etc/portage/make.conf
# emerge --sync
# echo 'sys-kernel/gentoo-sources symlink' >> /etc/portage/package.use
```

ここは個人の選択次第だが、私は desktop, gnome, systemd あたりを選択する.

```
# eselect profile list # 番号を確認
# eselect profile set NUM
```

カーネルのソースをインストールし、設定・ビルド・配置する。

```
# emerge -av gentoo-sources linux-firmware
# cd /usr/src/linux
# make nconfig
# make -j4 && make install && make modules_install
# cd /boot
# mount /dev/nvme0n1p1 efi
# mkdir -p efi/boot
# cp vmlinuz-*-gentoo efi/boot/bootx64.efi
```

以下のファイル・設定についてはいつもこれをコピペしている。make.conf はもっといじりようがあるかも。

#### /etc/portage/make.conf

```
MAKEOPTS="--jobs=4 --load-average=4"
GENTOO_MIRRORS="https://ftp.jaist.ac.jp/pub/Linux/Gentoo/"

ACCEPT_KEYWORDS="~amd64"
ACCEPT_LICENSE="*"
USE="cjk wayland"
VIDEO_CARDS="intel i965"
```

#### /etc/fstab

```
/dev/nvme0n1p1    /boot/efi     vfat    noauto,noatime 1 2
/dev/nvme0n1p2    none          swap    sw             0 0
/dev/nvme0n1p3    /             ext4    noatime        0 1
```

#### カーネルオプション

何故か GMail に下書きのメールとしてメモが残っていた限りだが、有効にしているオプション以下。

```
- CONFIG_BLK_DEV_NVME=y
- CONFIG_BLK_DEV_NVME=y
- CONFIG_BLK_DEV_THROTTLING=y
- CONFIG_BPF_SYSCALL=y
- CONFIG_CGROUP_BPF=y
- CONFIG_CMDLINE='root=/dev/nvme0n1p3 init=/usr/lib/systemd/systemd'
- CONFIG_CMDLINE_BOOL=y
- CONFIG_EFI_PARTITION=y
- CONFIG_EFI_STUB=y
- CONFIG_EXPERT=y
- CONFIG_FRAMEBUFFER_CONSOLE=y
- CONFIG_GENTOO_LINUX_INIT_SYSTEMD=y
- CONFIG_HID_BATTERY_STRENGTH=y
- CONFIG_HID_LENOVO=y
- CONFIG_IWLWIFI=m
- CONFIG_IWLWIFI_LEDS=y
- CONFIG_IWLWIWI_OPMODE_MDULER=y
- CONFIG_PARTITION_ADVANCED=y
- CONFIG_SND_HDA_GENERIC=y
- CONFIG_THINKPAD_ACPI=y
- CONFIG_USB_XHCI_PLATFORM=y
- OCNIFG_IWLMVM=m
```

## 仕上げ

ユーザを作って、`sudo` をいれて、GUI が起動するようにして、再起動しても動くなら成功かな？

## 参考資料

- https://wiki.gentoo.org/wiki/Handbook:AMD64/Full/Installation
- https://wiki.gentoo.org/wiki/Kernel/Configuration#Comparing_current_kernel_configuration_with_default_configuration

## 最後に

一年に何度かはパソコンが動かなくならないでほしい時期があるので、world をサボってたら案の定久しぶりの world が面倒になり、再インストールをしようとこの記事を書きました。
手元に余っているラップトップがあるならみなさんもインストールしてみてはいかがでしょうか。
