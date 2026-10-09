import type { SanityImageAsset } from '@/types/sanity.types';
import { urlFor } from '@/utils/image';
import type { Props } from 'astro-portabletext/types';

export const Image = ({ node: asset }: Props<SanityImageAsset>) => {
    return (
        <figure>
            <img
                src={urlFor(asset).auto('format').url()}
                data-image-zoom
                data-image-zoom-src={urlFor(asset).url()}
                role="button"
                tabIndex={0}
                aria-label={`Atidaryti didesnį vaizdą: ${asset.altText || asset.title || 'iliustracija'}`}
                alt={asset.altText || asset.title || asset.description}
                className="mx-auto cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
            />
            <figcaption>{asset.description || asset.title}</figcaption>
        </figure>
    );
};
