import Link from "next/link";
export default function NavBar() {
    type NavItem = {
        href: string;
        label: string;
        adminOnly?: boolean;
    };
    const navigationItems: NavItem[] = [
        {
            href: "/test1",
            label: "test1",
        },

        {
            href: "/test2",
            label: "test2",
        },

        {
            href: "/test3",
            label: "test3",
        },
    ];
    return (
        <div className="w-full">
            {navigationItems.map((item) => (
                <Link key={item.label} href={item.href}>{item.label}</Link>
            ))}
        </div>
    );
}
