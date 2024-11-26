import { colorSchemeAtom } from '@/stores/theme';
import { useAtom } from 'jotai';
import { FC, useMemo } from 'react';
import Select, { StylesConfig } from 'react-select';

interface SingleSelectProps {
    options: any[];
    value?: any;
    disabled?: boolean;
    onChange?: (value: any | null) => void;
    loading?: boolean;
    placeholder?: string;
    searchable?: boolean;
}

export const SingleSelect: FC<SingleSelectProps> = ({ options, disabled, loading, value, onChange, placeholder, searchable }) => {
    const [colorScheme] = useAtom(colorSchemeAtom);
    const components = useMemo<any>(() => {
        const comps: any = { IndicatorSeparator: null };

        if (loading) {
            comps.DropdownIndicator = null;
            comps.ClearIndicator = null;
            return comps;
        }

        if (value) comps.DropdownIndicator = null;
        else comps.ClearIndicator = null;
        return comps;
    }, [loading, value]);

    const styles = useMemo<StylesConfig<any>>(
        () => ({
            control: (styles, state) => ({
                ...styles,
                backgroundColor: colorScheme['base-100'],
                color: colorScheme['base-content'],
                borderColor: `oklch(var(--bc) / 0.2)`,
                boxShadow: 'none',
                ':hover': { borderColor: `oklch(var(--bc) / 0.2)` },
                borderRadius: `var(--rounded-btn, 0.5rem)`,
                minHeight: `3rem`,
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
                outlineOffset: '2px',
                outline: state.isFocused ? '2px solid oklch(var(--bc) / 0.2)' : undefined
            }),
            singleValue: (styles) => ({ ...styles, color: colorScheme['base-content'] }),
            placeholder: (styles) => ({ ...styles, color: `oklch(var(--bc) / 0.6)` }),
            input: (styles) => ({
                ...styles,
                color: colorScheme['base-content']
            }),
            menu: (styles) => ({
                ...styles,
                backgroundColor: colorScheme['base-100'],
                color: colorScheme['base-content']
            }),
            option: (styles, state) => ({
                ...styles,
                backgroundColor: state.isSelected
                    ? colorScheme.primary
                    : state.isFocused
                      ? colorScheme['base-300']
                      : colorScheme['base-100'],
                color: state.isSelected ? colorScheme['primary-content'] : colorScheme['base-content'],
                '&:hover': { backgroundColor: state.isSelected ? colorScheme.primary : colorScheme['base-300'] }
            })
        }),
        [colorScheme]
    );

    return (
        <Select
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            isDisabled={disabled || loading}
            isLoading={loading}
            isClearable={true}
            isSearchable={!value && searchable}
            options={options}
            styles={styles}
            components={components}
        />
    );
};
