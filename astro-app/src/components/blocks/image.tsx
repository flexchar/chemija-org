import type { SanityImageAsset } from '@/types/sanity.types';
import { urlFor } from '@/utils/image';
import type { Props } from 'astro-portabletext/types';

export const Image = ({ node: asset }: Props<SanityImageAsset>) => {
    return (
        <figure>
            <img
                src={urlFor(asset).auto('format').url()}
                alt={asset.altText || asset.title || asset.description}
                className="mx-auto"
            />
            <figcaption>{asset.description || asset.title}</figcaption>
        </figure>
    );
};
