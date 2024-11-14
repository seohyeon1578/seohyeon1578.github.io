import { danger, warn, message } from 'danger'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function checkFormatting(): Promise<void> {
  try {
    await execAsync('npm run format:check')
  } catch (error: any) {
    const files: string[] = danger.git.modified_files.concat(danger.git.created_files)
    const formattingIssues: string[] = files.filter(file => 
      error.stdout.includes(file)
    )

    if (formattingIssues.length > 0) {
      const formattedFileList: string = formattingIssues.map(file => `- ${file}`).join('\n')
      warn(`다음 파일들의 포맷팅이 필요합니다:\n${formattedFileList}\n\n코드를 포맷팅하려면 \`npm run format\`을 실행해주세요.`)
    }
  }
}

// 마크다운 파일 체크
const mdFiles = danger.git.modified_files.filter(f => f.endsWith('.md'))
mdFiles.forEach(file => {
  message(`\`${file}\` 파일이 수정되었습니다. 마크다운 문법을 확인해주세요.`)
})

// 실행
checkFormatting() 