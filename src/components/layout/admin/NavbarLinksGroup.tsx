import { Box, Collapse, Group, Text, ThemeIcon, Transition } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useState, type FC } from "react";
import { Link } from "react-router-dom";
import classes from "./NavbarLinksGroup.module.css";
import { useNavbarStore } from "../../../stores/NavbarStore";

interface LinkItem {
    label: string;
    link: string;
}

interface LinksGroupProps {
    icon: FC<{ size?: number }>;
    label: string;
    initiallyOpened?: boolean;
    links?: LinkItem[];
    link?: string;
}

export const LinksGroup = ({ icon: Icon, label, links, link }: LinksGroupProps) => {

    const hasLinks = Array.isArray(links);
    const [opened, setOpened] = useState(false);

    const { isOpen, toggle } = useNavbarStore();

    const items = (hasLinks ? links : []).map((link) => (
        <Text component={Link} className={classes.link} to={link.link} key={link.label}>
            {link.label}
        </Text>
    ));

    return (
        <>
            <button
                onClick={() => {
                    if (!link) {
                        if (!isOpen) { toggle() } else {
                            setOpened((open: boolean) => !open);
                        };
                    }
                }}
                className={classes.control}
                {...(link ? { component: Link, to: link } : {})}
            >
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <ThemeIcon variant="light" size={30}>
                            <Icon size={20} />
                        </ThemeIcon>
                        <Transition
                            mounted={isOpen}
                            transition="fade-left"
                            duration={100}
                            timingFunction="ease"
                            enterDelay={500}
                        >
                            {(styles) => (
                                <Box ml="md" style={styles}>
                                    {label}
                                </Box>
                            )}
                        </Transition>
                    </Box>
                    {hasLinks && (
                        <IconChevronRight
                            className={classes.chevron}
                            stroke={2}
                            size={20}
                            style={{ transform: (isOpen && opened) ? "rotate(90deg)" : "none" }}
                        />
                    )}
                </Group>
            </button>
            {hasLinks ? <Transition
                mounted={isOpen}
                transition="fade-left"
                duration={100}
                timingFunction="ease"
                enterDelay={500}
            >
                {(styles) => (
                    <Collapse in={isOpen && opened} style={styles}>
                        {items}
                    </Collapse>
                )}
            </Transition> : null}
        </>
    );
};
