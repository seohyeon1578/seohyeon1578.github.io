// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
import type { WorkExperience } from "../@types/WorkExperience";
import MissgoLogo from "../assets/companyLogo/missgo-logo.jpg";
import StartupLogo from "../assets/companyLogo/startup_logo.jpg";

export const SITE_TITLE = "Dante's Blog";
export const SITE_DESCRIPTION =
  "개발일을 하면서 겪은 경험을 기록하는 공간입니다.";

export const SOCIAL_GITHUB = "https://github.com/seohyeon1578";
export const SOCIAL_LINKEDIN =
  "https://www.linkedin.com/in/seohyeon-kim-b290bb243/";
export const SOCIAL_GMAIL = "mailto:gseohyeon07@gmail.com";

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: "(주)미스고",
    workPeriod: [new Date(2024, 0)],
    logo: MissgoLogo,
    description:
      "미스고는 지도를 기반으로 부동산 경매, 공매에 대한 정보를 제공하며 권리조사, 국공유지, 확장에정 도로, 등기, 건축물대장과 같은 기능들을 통해 부동산과 관련된 기능을 편리하게 사용할 수 있는 서비스를 만들어가고 있는 회사입니다.",
    roles: [
      {
        title: "Lead Software Engineer",
        workPeriod: [new Date(2024, 8)],
      },
      {
        title: "Software Engineer",
        workPeriod: [new Date(2024, 0), new Date(2024, 8)],
        content:
          " - Implemented map features such as search, polygon, animation, etc. that can be used on PC and WebView.\n\
\n\
- Automated the code review process using Github actions, shared the development content with the team members, and reduced the code review time. This reduced the response time to issues.\n\
\n\
- Applied test code to promote more stable development.\n\
\n\
- Introduced Vite to reduce build time by 40.01 seconds.\n\
\n\
- Improved server performance by 70% by separating the server provided to users and the crawling server. Also, by storing files stored in AWS S3 on the crawling server, reduced data transmission costs and saved 300 euros per month.\n\
\n\
- Automated some manual crawling tasks through scripts, reducing work hours by more than 20 hours per week.\n\
        ",
      },
    ],
  },
  {
    company: "Stealth Mode AI Startup",
    workPeriod: [new Date(2023, 6), new Date(2023, 11)],
    logo: StartupLogo,
    description:
      "미국 실리콘밸리에 위치한 스타트업으로 Llama2 AI를 활용한 채팅 서비스를 만들었습니다.",
    roles: [
      {
        title: "Software Engineer",
        workPeriod: [new Date(2023, 6), new Date(2023, 11)],
        content:
          " - Spearheaded development efforts from inception, focusing on JWT authentication and socket-based communication.\n\
\n\
- Designed and implemented versioning policies for remote bundles in React Native applications.\n\
\n\
- Implemented CI/CD pipelines using GitHub Actions for automated testing and deployment.\n\
\n\
- Developed server-side credential flow Google OAuth for streamlined user authentication and authorization\n\
\n\
- Modified react-native-rabbitmq library to enable RabbitMQ integration within a React Native chat service.\n\
\n\
- Enhanced build speed by 80% (from 2 minutes to under 20 seconds) by transitioning from Metro to esbuild.\n\
\n\
- Optimized page rendering frequency, reducing rerenders by 60% (from 20 to 8 times).\n\
        ",
      },
    ],
  },
];
