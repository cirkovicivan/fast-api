CREATE TABLE public.countries (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE INDEX countries_name_prefix_idx
ON public.countries (UPPER(name) text_pattern_ops);