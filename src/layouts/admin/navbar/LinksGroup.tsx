import { Box, Collapse, Group, rem, ThemeIcon, Tooltip, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavbarStore } from "../../../stores/NavbarStore";
import classes from "./LinksGroup.module.css";

interface LinksGroupProps {
    icon: React.ElementType;
    label: string;
    initiallyOpened?: boolean;
    link?: string;
    links?: { label: string; link: string }[];
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, link, links }: LinksGroupProps) {
    const { isOpen } = useNavbarStore();
    const hasLinks = Array.isArray(links);
    const [opened, setOpened] = useState(initiallyOpened || false);
    const { pathname } = useLocation();

    const items = (hasLinks ? links : []).map((link) => (
        <Link
            className={classes.link}
            to={link.link}
            key={link.label}
            style={{
                backgroundColor:
                    pathname === link.link ? "var(--mantine-color-orange-light)" : undefined,
                color: pathname === link.link ? "var(--mantine-color-orange-filled)" : undefined,
                fontWeight: pathname === link.link ? 600 : 400,
                display: isOpen ? "block" : "none",
            }}
        >
            {link.label}
        </Link>
    ));

    const content = (
        <UnstyledButton
            onClick={() => setOpened((o) => !o)}
            className={classes.control}
            style={{
                backgroundColor:
                    link && pathname === link ? "var(--mantine-color-orange-light)" : undefined,
                color: link && pathname === link ? "var(--mantine-color-orange-filled)" : undefined,
            }}
        >
            <Tooltip label={label} position="right" disabled={isOpen} withArrow>
                <Group justify="space-between" gap={0} wrap="nowrap">
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <ThemeIcon variant="light" size="30" color="orange">
                            <Icon style={{ width: rem(18), height: rem(18) }} />
                        </ThemeIcon>
                        {isOpen && <Box ml="md">{label}</Box>}
                    </Box>
                    {hasLinks && isOpen && (
                        <IconChevronRight
                            className={classes.chevron}
                            stroke={1.5}
                            style={{
                                width: rem(16),
                                height: rem(16),
                                transform: opened ? "rotate(-90deg)" : "none",
                            }}
                        />
                    )}
                </Group>
            </Tooltip>
        </UnstyledButton>
    );

    return (
        <>
            {link ? (
                <Link to={link} style={{ textDecoration: "none", color: "inherit" }}>
                    {content}
                </Link>
            ) : (
                content
            )}
            {hasLinks && isOpen ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
    );
}
