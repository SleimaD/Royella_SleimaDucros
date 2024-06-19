import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { HiArrowLongRight } from "react-icons/hi2";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

const DraggableItem = ({ id, service, index, moveService }) => {
    const ref = useRef(null);
    const [, drop] = useDrop({
        accept: "service",
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveService(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: "service",
        item: { type: 'service', id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    return (
        <div ref={ref} style={{ opacity }} className="flex  m-2 p-2 bg-white ">
            <div className="w-[60%] flex gap-4 ">
                <img src={service.image} alt={service.title} className="w-[30rem] h-[100%] object-cover" />
                <div>
                    <h2 className="text-[22px] sm:text-2xl md:text-3xl 2xl:text-[40px] text-khaki leading-[38px] lg:leading-[44px] font-semibold font-Garamond">{index + 1 < 10 ? `0${index + 1}` : index + 1}</h2>
                </div>
            </div>
            <div className="w-[40%]">
                <h4 className="text-base font-semibold text-khaki leading-[26px] pb-[6px] uppercase mt-2 md:mt-0 font-Garamond">{service.subtitle}</h4>
                <h1 className="text-2xl md:text-3xl 2xl:text-[32px] leading-[26px] font-semibold text-lightBlack dark:text-white font-Garamond">
                    {service.title}
                </h1>
                <p className="font-Lora text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] font-normal my-10 lg:mt-[46px] lg:mb-[40px] before:absolute before:h-[30px] before:left-0 before:top-[-35px] before:bg-[#ddd] before:w-[1px] relative">{service.description}</p>
            </div>
        </div>
    );
};

const ServicesBack = () => {
    const [services, setServices] = useState([]);
    const [initialServices, setInitialServices] = useState([]);
    const [hasChanged, setHasChanged] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/services/");
                const data = await response.json();
                console.log('Fetched services:', data);
                setServices(data);
                setInitialServices(data);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchServices();
    }, []);

    const moveService = (dragIndex, hoverIndex) => {
        const dragService = services[dragIndex];
        setServices(update(services, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragService],
            ],
        }));
        setHasChanged(true);
    };

    const saveOrder = async () => {
        const updatedOrder = services.map(service => service.id);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/services/update_order/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order: updatedOrder })
            });

            if (!response.ok) {
                throw new Error('Failed to update service order');
            }

            const result = await response.json();
            setInitialServices(services);
            setHasChanged(false);
            alert('Order saved successfully!');
        } catch (error) {
            console.error('Error saving service order:', error);
            alert('Failed to save order.');
        }
    };

    const cancelChanges = () => {
        setServices(initialServices);
        setHasChanged(false);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <h3 className='text-2xl font-Garamond uppercase underline p-2 text-center mt-3 mb-5'>services</h3>
            <div className="bg-gray-100 min-h-screen  flex justify-center items-center">
                <div className="w-full bg-[#f6f4f4] p-5 rounded-lg">
                    <div className="mb-5 flex flex-col gap-3">
                        <h1 className="text-[22px] sm:text-2xl md:text-3xl 2xl:text-[30px] leading-[38px] lg:leading-[44px]  text-lightBlack dark:text-white font-semibold font-Garamond">COMPLETE & BEST QUALITY FACILITIES  </h1>
                        <small className="text-center flex justify-center items-center p-1 text-green-500">(Drag and Drop to reorder)</small>
                    </div>
                    
                    <div>
                        {services.map((service, index) => (
                            <div>
                            <DraggableItem
                                key={service.id}
                                id={`service-${service.id}`}
                                service={service}
                                index={index}
                                moveService={moveService}
                            />
                            <hr className="text-[#e8e8e8] dark:text-[#383838] mb-1 mt-1" />

                            </div>
                        ))}
                    </div>
                    {hasChanged && (
                        <div className="flex justify-end mt-5">
                            <button onClick={saveOrder} className="mr-2 p-2 btn-primary text-white ">Save Order</button>
                            <button onClick={cancelChanges} className="p-2 btn-secondary bg-red-500 text-white ">Cancel</button>
                        </div>
                    )}
                </div>
            </div>
        </DndProvider>
    );
};

export default ServicesBack;
