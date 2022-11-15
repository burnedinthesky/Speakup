import { TableCell, TableRow } from "@tremor/react";

const IssueRowLoading = () => {
    return (
        <TableRow>
            <TableCell textAlignment="text-left">
                <div className="h-5 w-48 animate-pulse rounded-md bg-slate-300" />
            </TableCell>
            <TableCell textAlignment="text-center">
                <div className="mx-auto h-5 w-8 animate-pulse rounded-md bg-slate-300" />
            </TableCell>
            <TableCell textAlignment="text-center">
                <div className="mx-auto h-5 w-8 animate-pulse rounded-md bg-slate-300" />
            </TableCell>
            <TableCell textAlignment="text-center">
                <div className="mx-auto h-5 w-8 animate-pulse rounded-md bg-slate-300" />
            </TableCell>
            <TableCell textAlignment="text-center">
                <div className="mx-auto h-5 w-8 animate-pulse rounded-md bg-slate-300" />
            </TableCell>
            <TableCell textAlignment="text-center">{}</TableCell>
        </TableRow>
    );
};
export default IssueRowLoading;
