import { formatDistanceToNow } from 'date-fns';
import { lt } from 'date-fns/locale';

// format date using date-fns
export function formatDate(date: string) {
    // Use the proper Lithuanian locale from date-fns
    return formatRelativeDate(date);
}

// format relative date to now using date-fns
export function formatRelativeDate(date: string) {
    return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: lt,
    });
}
