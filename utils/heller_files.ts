const hellerFilesMap = [
    {
      filename: "2043MK7 System User Manual - Flux Reactor Maintenance.pdf",
      link: "https://drive.google.com/file/d/1mMNbQBWnw-ejenPIXYpwPI0hMVWvPC6n/view?usp=sharing",
    },
    {
      filename: "848861 REACTOR UPGRADE TEST Retrofit (R2).xlsx",
      link: "https://docs.google.com/spreadsheets/d/1I4rKI4aEW6XXjQ6PuX2JY-1tOJBSSe8W/edit?usp=sharing&ouid=111377379083910385195&rtpof=true&sd=true",
    },
    {
      filename: "854508 Reactor Catalyst Remove Retrofit (R1).xls",
      link: "https://docs.google.com/spreadsheets/d/1raFr_s729zOelX32wUEyoRogoFW7iLzy/edit?usp=sharing&ouid=111377379083910385195&rtpof=true&sd=true",
    },
    {
      filename: "4177290 (rev. A).pdf",
      link: "https://drive.google.com/file/d/1Njp7QsRF3AwoEu9DbQTO22UIizWVJ_gF/view?usp=sharing",
    },
    {
      filename: "4188290 (rev. A).pdf",
      link: "https://drive.google.com/file/d/1iLM2FgaNWjrF4pEBb3zRx542VjjZtrtO/view?usp=sharing",
    },
    {
      filename:
        "4196387-Instructions  for Reactor Upgrade Retrofit (A)_RFC-355.pdf",
      link: "https://drive.google.com/file/d/1HaCNL5PmP6ONPtNL0jcYr7rHVm6o3X2B/view?usp=sharing",
    },
    {
      filename:
        "4224364-Instruction  For Reactor Catalyst Remove Retrofit(A).pdf",
      link: "https://drive.google.com/file/d/156qAD4F-I8HzQ1uVSHDpbDKG0VuWdlJd/view?usp=sharing",
    },
    {
      filename: "ALPHA zeolite and catalyst (7-26-22) abridged.pdf",
      link: "https://drive.google.com/file/d/1WOlwn2_2vwFbvGIxIg3ow6AbX2dTOaPt/view?usp=sharing",
    },
    {
      filename: "Heller Flux Reactor Overview (4-11-23).pdf",
      link: "https://drive.google.com/file/d/1c_uoS2NBQ5C87samRf5yE0pIz1WGGiXz/view?usp=sharing",
    },
    {
      filename:
        "Reactor Return Gas into Big Flux box Test with Heat Exchanger Water OFF (RFC355).pdf",
      link: "https://drive.google.com/file/d/1aIQC2PZejl6RDHF9ewY1ymgVj_-sL5Ye/view?usp=sharing",
    },
    {
      filename:
        "RFC-355  Reactor Catalyst Upgrade And Return Gas Into Flux Box.pdf",
      link: "https://drive.google.com/file/d/1PxlqRdSr4fqqlTKkxiIaophIfkIRDSld/view?usp=sharing",
    },
    {
      filename:
        "RFC-398 Reactor Catalyst Remove Tooling (17).pdf",
      link: "https://drive.google.com/file/d/1OxsvEUasqYWHiQPqPGe59hfATr2uXC7O/view?usp=sharing",
    },
  ];

export const getHellerFileDriveUrl = (fileName: string) => {
    const file = hellerFilesMap.find((file) => file.filename.includes(fileName));

    return file?.link;
}

export const getHellerFileDirectUrl = (fileName: string) => {
    const file = hellerFilesMap.find((file) => file.filename.includes(fileName));

    return `${window.location.origin}/heller_files/${file?.filename}`;
}

export const checkHellerFileTypePdf = (fileName: string) => {
    const file = hellerFilesMap.find((file) => file.filename.includes(fileName));
    return file?.filename.includes(".pdf");
}