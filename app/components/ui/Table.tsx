import { ReactNode, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export function Table({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto">
      <table
        className={`w-full caption-bottom text-sm ${className || ''}`}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`[&_tr]:border-b bg-muted/50 ${className || ''}`} {...props} />
  );
}

export function TableBody({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`[&_tr:last-child]:border-0 ${className || ''}`} {...props} />;
}

export function TableFooter({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={`border-t bg-muted/50 font-medium [&>tr]:last:border-b-0 ${className || ''}`}
      {...props}
    />
  );
}

export function TableRow({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${
        className || ''
      }`}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${
        className || ''
      }`}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className || ''}`}
      {...props}
    />
  );
}

export function TableCaption({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={`mt-4 text-sm text-muted-foreground ${className || ''}`}
      {...props}
    />
  );
}
