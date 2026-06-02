import { resume } from "./resume";

export const socialLinks = [
    {
        label: "Email",
        href: "mailto:leanale003@gmail.com",
        external: true,
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/in/leanale",
        external: true,
    },
    {
        label: "GitHub",
        href: "https://github.com/chuot-the-rat",
        external: true,
    },
    {
        label: resume.label,
        href: resume.publicPath,
        download: resume.fileName,
    },
];
