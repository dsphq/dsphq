export default [
    {
        actionName: 'xvexec',
        primary: '{$.handler_account_name} - {$.data.payload.name}',
        secondary: '{$.data.payload.data.payload.username}'
    },
    {
        actionName: 'xgeturi',
        primary: 'Oracle Data',
        secondary: 'uri: {$.data.uri}'
    },
    {
        actionName: 'xsignal',
        primary: 'DSP Service Request',
        secondary: '{$.data.action}'
    },
    {
        contract: 'dappservices',
        actionName: 'usage',
        primary: 'DSP Usage Report',
        secondary: '{$.data.usage_report.package} \u2022 {$.data.usage_report.service} \u2022 {$.data.usage_report.provider}'
    },
    {
        contract: 'dappservices',
        actionName: 'transfer',
        primary: '{$.data.from} sent {$.data.quantity} to {$.data.to}',
    },
    {
        contract: 'dappservices',
        actionName: 'stake',
        primary: '{$.data.from} staked {$.data.quantity}',
        secondary: '{$.data.service} \u2022 {$.data.provider}',
    },
    {
        contract: 'dappservices',
        actionName: 'unstake',
        primary: '{$.data.to} unstaked {$.data.quantity}',
        secondary: '{$.data.service} \u2022 {$.data.provider}'
    },
    {
        contract: 'dappservices',
        actionName: 'selectpkg',
        primary: '{$.data.owner} selected package',
        secondary: '{$.data.package} \u2022 {$.data.service} \u2022 {$.data.provider}',
    },
    {
        contract: 'dappservices',
        actionName: 'refreceipt',
        primary: 'Refund Receipt',
        secondary: '{$.data.quantity}',
    },
    {
        contract: 'dappairhodl1',
        actionName: 'refreceipt',
        primary: 'Refund Receipt',
        secondary: '{$.data.quantity}',
    },
    {
        contract: 'dappservices',
        actionName: 'closeprv',
        primary: 'Deselected Package',
        secondary: '{$.data.service} \u2022 {$.data.provider}'
    }
];