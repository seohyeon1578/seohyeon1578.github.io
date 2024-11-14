import { danger, warn, message, fail } from "danger";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function checkPRSize(): Promise<void> {
  const { additions = 0, deletions = 0 } = danger.github.pr;
  const changes = additions + deletions;

  if (changes > 500) {
    warn("PR이 너무 큽니다. 가능하다면 더 작은 단위로 분리해주세요.");
  }
}

async function checkFormatting(): Promise<void> {
  const files: string[] = danger.git.modified_files.concat(
    danger.git.created_files,
  );

  const relevantFiles = files.filter((file) =>
    /\.(ts|tsx|js|jsx|md|astro)$/.test(file),
  );

  if (relevantFiles.length === 0) return;

  try {
    for (const file of relevantFiles) {
      try {
        const { stdout, stderr } = await execAsync(
          `npx prettier --check "${file}"`,
        );
      } catch (error: any) {
        warn(`${file} 파일의 포맷팅이 필요합니다.
        
실행 방법:
1. \`npm run format\` 으로 모든 파일 포맷팅
2. \`npx prettier --write "${file}"\` 로 개별 파일 포맷팅`);
      }
    }
  } catch (error: any) {
    fail(`Prettier 검사 중 오류가 발생했습니다: ${error.message}
prettier가 설치되어 있는지 확인해주세요.`);
  }
}

async function checkPackageChanges(): Promise<void> {
  const packageChanged = danger.git.modified_files.includes("package.json");
  const lockfileChanged =
    danger.git.modified_files.includes("package-lock.json");

  if (packageChanged && !lockfileChanged) {
    fail(
      "package.json이 수정되었지만 package-lock.json이 업데이트되지 않았습니다.",
    );
  }
}

// 메인 실행 함수
async function runDangerChecks(): Promise<void> {
  await Promise.all([checkPRSize(), checkFormatting(), checkPackageChanges()]);
}

runDangerChecks();
