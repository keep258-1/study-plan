document.addEventListener('DOMContentLoaded', function () {
    const token = 'YOUR_GITHUB_TOKEN'; // 👈 把你的令牌粘贴在这里
    const repoOwner = 'keep258-1';      // 👈 你的 GitHub 用户名
    const repoName = 'study-plan';      // 👈 你的仓库名

    // 1. 创建浮动按钮
    const button = document.createElement('button');
    button.innerText = '保存修改到 GitHub';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#0366d6';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    document.body.appendChild(button);

    // 2. 使页面内容可编辑
    document.body.contentEditable = true;

    // 3. 保存逻辑
    button.addEventListener('click', async () => {
        const filePath = window.location.pathname.split('/').pop() || 'index.html';
        const fileContent = document.documentElement.outerHTML;

        try {
            // 获取当前文件的 SHA（用于更新）
            const shaResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'User-Agent': 'StudyPlanEditor'
                }
            });

            const shaData = await shaResponse.json();
            const sha = shaData.sha;

            // 提交更新
            const commitResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'StudyPlanEditor'
                },
                body: JSON.stringify({
                    message: `Update ${filePath} via Web Editor`,
                    content: btoa(encodeURIComponent(fileContent).replace(/%([0-9A-F]{2})/g, function(match, p1) {
                        return String.fromCharCode('0x' + p1);
                    })),
                    sha: sha,
                    branch: 'main' // 如果你的分支是 master，请改为 'master'
                })
            });

            if (commitResponse.ok) {
                alert('✅ 保存成功！刷新页面查看效果。');
            } else {
                alert('❌ 保存失败，请检查令牌或网络。');
            }
        } catch (error) {
            console.error(error);
            alert('❌ 出错了：' + error.message);
        }
    });
});
