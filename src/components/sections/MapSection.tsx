import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

interface MapSectionProps {
  address?: string;
  latitude?: number;
  longitude?: number;
  className?: string;
}

export function MapSection({
  address,
  latitude,
  longitude,
  className,
}: MapSectionProps) {
  const hasCoordinates = latitude && longitude;
  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : null;

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <Container>
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          {/* Map - prioritize coordinates when available */}
          <div className="aspect-video bg-stone-200">
            {hasCoordinates ? (
              <iframe
                src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=17&output=embed&hl=zh-TW`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="地圖"
              />
            ) : address ? (
              <iframe
                src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=17&output=embed&hl=zh-TW`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="地圖"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-500">
                <svg
                  className="h-16 w-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Address Info */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-stone-900">地址</h3>
            {address ? (
              <p className="mt-2 text-stone-600">{address}</p>
            ) : (
              <p className="mt-2 text-stone-500">地址資訊尚未提供</p>
            )}

            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                在 Google 地圖中開啟
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
